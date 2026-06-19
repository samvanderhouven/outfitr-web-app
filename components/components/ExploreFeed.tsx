"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PostCard from "./PostCard";
import type { ExploreResponse, OutfitrPost } from "@/lib/types";

export default function ExploreFeed({
  initialPosts,
  initialNextCursor,
  initialHasMore,
}: {
  initialPosts: OutfitrPost[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
}) {
  const [posts, setPosts] = useState<OutfitrPost[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "12" });
      if (nextCursor) qs.set("cursor", nextCursor);
      const res = await fetch(`/api/explore?${qs.toString()}`);
      const json: ExploreResponse = await res.json();
      const newPosts = json?.data?.posts || [];
      setPosts((prev) => [...prev, ...newPosts]);
      setNextCursor(json?.data?.nextCursor ?? null);
      setHasMore(Boolean(json?.data?.hasMore) && newPosts.length > 0);
    } catch (error) {
      console.error("Failed to load more explore posts", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, nextCursor]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="font-display text-xl text-brand-text">
          Nog geen posts om te ontdekken
        </p>
        <p className="max-w-xs text-sm text-brand-light-text">
          Kom snel terug, of open de app voor de volledige ervaring.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="masonry-columns">
        {posts.map((post) => (
          <div className="masonry-item" key={post._id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-10 w-full" />

      {isLoading && (
        <div className="flex justify-center py-6">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-secondary border-t-brand-primary" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="py-8 text-center text-xs uppercase tracking-wide text-brand-light-text">
          Je hebt alles gezien
        </p>
      )}
    </div>
  );
}
