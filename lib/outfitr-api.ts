import "server-only";
import type {
  ExploreResponse,
  OutfitrPost,
  OutfitrProfile,
  PostByIdResponse,
  UserPostsResponse,
} from "./types";
import { isObjectId, normalizeHandle } from "./profile-utils";

const API_BASE_URL =
  process.env.OUTFITR_API_BASE_URL || "https://api.outfitr.nl/api/v1";

/**
 * Error carrying the upstream HTTP status, so callers can tell
 * "this profile does not exist" (404) from "this endpoint still requires a
 * token" (401/403) and render the right state.
 */
export class OutfitrApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(status: number, path: string, message: string) {
    super(message);
    this.name = "OutfitrApiError";
    this.status = status;
    this.path = path;
  }

  /** The public web app sends no token — these mean the route is auth-gated. */
  get isAuthGated(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new OutfitrApiError(
      res.status,
      path,
      `Outfitr API ${path} failed: ${res.status} ${res.statusText} ${text}`,
    );
  }

  return res.json() as Promise<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractPosts(data: any): OutfitrPost[] {
  return data?.results ?? data?.posts ?? [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractCursor(data: any): string | null {
  return data?.nextCursor ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractHasMore(data: any): boolean {
  return Boolean(data?.hasMore);
}

export async function getExplorePosts(params?: {
  cursor?: string | null;
  limit?: number;
}): Promise<ExploreResponse> {
  const query = new URLSearchParams();
  if (params?.cursor) query.set("cursor", params.cursor);
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  // No token required — Explore API is public.
  // Real API returns { data: { results: [...] } } or { results: [...] }
  // We normalise both into ExploreResponse shape ({ data: { posts: [...] } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await apiFetch<any>(`/explore${qs ? `?${qs}` : ""}`);
  const data = raw?.data ?? raw;

  return {
    success: true,
    data: {
      posts: extractPosts(data),
      nextCursor: extractCursor(data),
      hasMore: extractHasMore(data),
    },
  };
}

export async function getPostById(id: string): Promise<PostByIdResponse> {
  return apiFetch<PostByIdResponse>(
    `/post/get-post/${encodeURIComponent(id)}`,
  );
}

export async function registerPostClick(
  id: string,
  payload: {
    brandId?: string;
    mediaIndex?: number;
    referrer?: string;
    metaData?: Record<string, unknown>;
  },
): Promise<void> {
  await apiFetch(`/post/click-post/${encodeURIComponent(id)}`, {
    method: "POST",
    body: JSON.stringify({
      brandId: payload.brandId ?? "",
      mediaIndex: payload.mediaIndex ?? 0,
      referrer: payload.referrer ?? "",
      metaData: payload.metaData ?? {},
    }),
  });
}

/* ────────────────────────── Public profiles ────────────────────────── */

/**
 * How a profile was resolved. `search-fallback` means the primary profile
 * endpoint was unavailable to an anonymous caller and we reconstructed the
 * header from the public `/explore/search` payload, which carries no counts.
 */
export type ProfileSource = "profile-api" | "search-fallback";

export interface ProfileResult {
  profile: OutfitrProfile;
  source: ProfileSource;
}

// Fields we deliberately drop before the profile reaches the browser.
// The current backend `getProfile` selects `email` (and privacy settings);
// none of that belongs in a public, server-rendered page.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPublicProfile(raw: any): OutfitrProfile {
  return {
    _id: String(raw?._id ?? ""),
    username: raw?.username ?? undefined,
    fullName: raw?.fullName ?? undefined,
    profilePicture: raw?.profilePicture ?? undefined,
    bio: raw?.bio ?? undefined,
    isVerified: Boolean(raw?.isVerified),
    badge: raw?.badge ?? "none",
    totalPosts:
      typeof raw?.totalPosts === "number" ? raw.totalPosts : undefined,
    totalFollowers:
      typeof raw?.totalFollowers === "number" ? raw.totalFollowers : undefined,
    totalFollowing:
      typeof raw?.totalFollowing === "number" ? raw.totalFollowing : undefined,
    isPrivate: raw?.accountType === "private" || Boolean(raw?.isPrivate),
  };
}

/**
 * Look a user up through the public explore search. This is the only
 * anonymous-accessible source of profile data on the current backend, so it
 * doubles as the fallback while `/profile/get-profile` is still auth-gated.
 * Only usable for usernames — search does not match on id.
 */
async function findProfileViaSearch(
  handle: string,
): Promise<OutfitrProfile | null> {
  const normalized = normalizeHandle(handle);
  const query = new URLSearchParams({
    search: normalized,
    userLimit: "20",
    postLimit: "1",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await apiFetch<any>(`/explore/search?${query.toString()}`);
  const data = raw?.data ?? raw;
  const users: unknown[] = data?.users ?? data?.results?.users ?? [];

  const match = (users as Array<Record<string, unknown>>).find(
    (candidate) =>
      normalizeHandle(String(candidate?.username ?? "")) === normalized,
  );

  return match ? toPublicProfile(match) : null;
}

/**
 * Resolve a public profile from a URL segment that is either a username or a
 * user id.
 *
 * Returns `null` when the user genuinely does not exist. Throws
 * `OutfitrApiError` only for unexpected upstream failures.
 */
export async function getProfileByHandle(
  handle: string,
): Promise<ProfileResult | null> {
  const trimmed = handle.trim();
  if (!trimmed) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiFetch<any>(
      `/profile/get-profile/${encodeURIComponent(trimmed)}`,
    );
    const data = raw?.data ?? raw;
    if (data?._id) {
      return { profile: toPublicProfile(data), source: "profile-api" };
    }
  } catch (error) {
    const apiError = error instanceof OutfitrApiError ? error : null;

    // 401/403 → the endpoint has not been opened to anonymous callers yet.
    // 404/400 → this backend build does not resolve usernames on that route.
    // Both are recoverable via the public search fallback for usernames.
    const recoverable =
      apiError !== null &&
      (apiError.isAuthGated || apiError.isNotFound || apiError.status === 400);

    if (!recoverable) throw error;
  }

  if (isObjectId(trimmed)) {
    // Search cannot resolve an id, so there is nothing left to try.
    return null;
  }

  const fromSearch = await findProfileViaSearch(trimmed);
  return fromSearch ? { profile: fromSearch, source: "search-fallback" } : null;
}

/**
 * Public posts for a profile. Accepts a username or a user id; the caller
 * should pass the resolved `_id` when it has one.
 *
 * Throws `OutfitrApiError` with `isAuthGated` when the backend still requires
 * a token, so the page can distinguish "no posts yet" from "cannot list posts".
 */
export async function getUserPosts(
  handle: string,
  params?: { cursor?: string | null; limit?: number },
): Promise<UserPostsResponse> {
  const query = new URLSearchParams();
  if (params?.cursor) query.set("cursor", params.cursor);
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await apiFetch<any>(
    `/post/get-user-posts/${encodeURIComponent(handle)}${qs ? `?${qs}` : ""}`,
  );
  const data = raw?.data ?? raw;

  return {
    posts: extractPosts(data),
    nextCursor: extractCursor(data),
    hasMore: extractHasMore(data),
  };
}
