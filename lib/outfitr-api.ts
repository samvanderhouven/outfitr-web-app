import "server-only";
import type { ExploreResponse, OutfitrPost, PostByIdResponse } from "./types";
 
const API_BASE_URL =
  process.env.OUTFITR_API_BASE_URL || "https://api.outfitr.nl/api/v1";
 
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
    throw new Error(
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
 
