"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { OutfitrPost, UserPostsResponse } from "@/lib/types";
import { getPrimaryMedia } from "@/lib/post-utils";
import { GridIcon, LockIcon, PlayIcon, VideoIcon } from "./icons";

type Tab = "posts" | "videos";

function isVideoPost(post: OutfitrPost): boolean {
  return getPrimaryMedia(post)?.mediaType === "video";
}

function GridTile({ post, from }: { post: OutfitrPost; from: string }) {
  const media = getPrimaryMedia(post);
  const video = isVideoPost(post);

  return (
    <Link
      href={`/post/${post._id}?from=${encodeURIComponent(from)}`}
      className="group relative block aspect-square overflow-hidden bg-brand-secondary-soft sm:rounded-lg"
      aria-label={post.description || "Open outfit"}
    >
      {media?.mediaUrl ? (
        video ? (
          <video
            src={media.mediaUrl}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.mediaUrl}
            alt={post.description || "OutfitR outfit"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs text-brand-light-text">
          No media
        </span>
      )}

      {video && (
        <span className="pointer-events-none absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <PlayIcon className="h-3 w-3" />
        </span>
      )}

      <span className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </Link>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-20 text-center">
      <p className="text-sm text-brand-light-text">{label}</p>
    </div>
  );
}

/**
 * The scrollable profile feed. Mirrors the mobile profile grid: a two-tab
 * bar (photos / videos) over a three-column square grid, paginated with the
 * same cursor the mobile screen uses, here driven by an IntersectionObserver
 * instead of onEndReached.
 */
export default function ProfileGrid({
  handle,
  initialPosts,
  initialNextCursor,
  initialHasMore,
  /** True when the profile is private — posts must not be listed at all. */
  isPrivate = false,
  /**
   * True when the posts endpoint refused an anonymous request. Rendered as an
   * explicit state so it never looks like "this creator has no outfits".
   */
  postsUnavailable = false,
}: {
  handle: string;
  initialPosts: OutfitrPost[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
  isPrivate?: boolean;
  postsUnavailable?: boolean;
}) {
  const [posts, setPosts] = useState<OutfitrPost[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [tab, setTab] = useState<Tab>("posts");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || loadFailed) return;
    setIsLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "24" });
      if (nextCursor) qs.set("cursor", nextCursor);
      const res = await fetch(
        `/api/user-posts/${encodeURIComponent(handle)}?${qs.toString()}`,
      );
      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      const json: UserPostsResponse = await res.json();
      const incoming = json?.posts || [];
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p._id));
        return [...prev, ...incoming.filter((p) => p._id && !seen.has(p._id))];
      });
      setNextCursor(json?.nextCursor ?? null);
      setHasMore(Boolean(json?.hasMore) && incoming.length > 0);
    } catch (error) {
      console.error("Failed to load more profile posts", error);
      setLoadFailed(true);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [handle, hasMore, isLoading, loadFailed, nextCursor]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const photoPosts = useMemo(
    () => posts.filter((post) => !isVideoPost(post)),
    [posts],
  );
  const videoPosts = useMemo(
    () => posts.filter((post) => isVideoPost(post)),
    [posts],
  );

  if (isPrivate) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <LockIcon className="h-10 w-10 text-brand-light-text" />
        <p className="font-display text-lg font-semibold text-brand-text">
          This account is private
        </p>
        <p className="max-w-xs text-sm text-brand-light-text">
          Follow this creator in the OutfitR app to see their outfits.
        </p>
      </div>
    );
  }

  if (postsUnavailable) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
        <p className="font-display text-lg font-semibold text-brand-text">
          Outfits couldn&apos;t be loaded
        </p>
        <p className="max-w-xs text-sm text-brand-light-text">
          Please try again in a moment, or open this profile in the OutfitR app.
        </p>
      </div>
    );
  }

  const visible = tab === "posts" ? photoPosts : videoPosts;
  const hasVideos = videoPosts.length > 0;

  return (
    <section>
      {hasVideos && (
        <div
          role="tablist"
          aria-label="Profile content"
          className="flex border-b border-brand-border"
        >
          {(
            [
              ["posts", "Outfits", GridIcon],
              ["videos", "Videos", VideoIcon],
            ] as const
          ).map(([key, label, Icon]) => {
            const active = tab === key;
            return (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={`relative flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                  active ? "text-brand-primary" : "text-brand-light-text"
                }`}
              >
                <Icon className="h-[22px] w-[22px]" />
                <span className="hidden sm:inline">{label}</span>
                {active && (
                  // left-1/2 + translate, otherwise the indicator is laid out
                  // after the label instead of under the middle of the tab.
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          label={
            tab === "videos"
              ? "No videos yet."
              : "This creator hasn't shared any outfits yet."
          }
        />
      ) : (
        <div className="grid grid-cols-3 gap-px sm:gap-2 lg:grid-cols-4 lg:gap-3">
          {visible.map((post) => (
            <GridTile key={post._id} post={post} from={handle} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-10 w-full" />

      {isLoading && (
        <div className="flex justify-center py-6">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-secondary border-t-brand-primary" />
        </div>
      )}

      {loadFailed && (
        <p className="py-6 text-center text-xs text-brand-light-text">
          Couldn&apos;t load more outfits.
        </p>
      )}

      {!hasMore && !loadFailed && visible.length > 0 && (
        <p className="py-8 text-center text-xs uppercase tracking-wide text-brand-light-text">
          You&apos;ve seen everything
        </p>
      )}
    </section>
  );
}
