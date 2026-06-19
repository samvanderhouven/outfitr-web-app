import type { OutfitrPost, OutfitrUser } from "./types";

export function getPostUser(post: OutfitrPost): OutfitrUser | undefined {
  if (!post.userId) return undefined;
  if (typeof post.userId === "string") return undefined;
  return post.userId;
}

export function getInitial(nameOrUsername?: string): string {
  return (nameOrUsername || "U").trim().charAt(0).toUpperCase() || "U";
}

export function getPrimaryMedia(post: OutfitrPost) {
  return post.media?.[0];
}

export function formatCount(count?: number): string {
  const n = count || 0;
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
