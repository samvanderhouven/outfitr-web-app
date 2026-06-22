import "server-only";
import type { ExploreResponse, PostByIdResponse } from "./types";

const API_BASE_URL =
  process.env.OUTFITR_API_BASE_URL || "https://api.outfitr.nl/api/v1";

/**
 * All calls to the Outfitr backend happen from the server (route handlers /
 * server components), never directly from the browser. This sidesteps any
 * CORS restrictions on api.outfitr.nl, since the browser only ever talks to
 * our own Next.js app.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    // Explore + post detail pages should always reflect fresh data.
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Outfitr API ${path} failed: ${res.status} ${res.statusText} ${text}`,
    );
  }

  return res.json() as Promise<T>;
}

export async function getExplorePosts(params?: {
  cursor?: string | null;
  limit?: number;
}): Promise<ExploreResponse> {
  const query = new URLSearchParams();
  if (params?.cursor) query.set("cursor", params.cursor);
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();

  // The real API is now public (no token required).
  // The API returns data.posts (and previously used data.results in some versions).
  // We normalise both so the web app always gets data.posts.
  const raw = await apiFetch<ExploreResponse>(`/explore${qs ? `?${qs}` : ""}`);

  // Normalise: if the API returned `results` instead of `posts`, remap it.
  if (raw?.data && !raw.data.posts && (raw.data as Record<string, unknown>)["results"]) {
    raw.data.posts = (raw.data as Record<string, unknown>)["results"] as ExploreResponse["data"]["posts"];
  }

  return raw;
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
