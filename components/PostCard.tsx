"use client";

import Link from "next/link";
import type { OutfitrPost } from "@/lib/types";
import { getPostUser, getPrimaryMedia } from "@/lib/post-utils";
import { profilePath } from "@/lib/profile-utils";

// Give each tile a stable, reserved height so images stop shifting the layout
// as they lazy-load. A ratio is picked deterministically from the post id, so
// the same post always gets the same height — this keeps the masonry look
// (varied heights) while reserving each tile's space up front.
const RATIOS = ["3 / 4", "4 / 5", "1 / 1", "5 / 6"];

function ratioFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return RATIOS[hash % RATIOS.length];
}

export default function PostCard({ post }: { post: OutfitrPost }) {
  const media = getPrimaryMedia(post);
  const isVideo = media?.mediaType === "video";
  const mediaUrl = media?.mediaUrl;
  const ratio = ratioFor(post._id);
  const user = getPostUser(post);
  const userProfilePath = profilePath(user);

  return (
    // A wrapper rather than a single clickable element: the post link fills the
    // tile, and the creator link sits above it. Nesting one inside the other
    // would be invalid markup and would swallow the creator tap.
    <div
      className="group relative w-full overflow-hidden rounded-2xl bg-brand-secondary-soft"
      style={{ aspectRatio: ratio }}
    >
      {mediaUrl ? (
        isVideo ? (
          <video
            src={mediaUrl}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt={post.description || "OutfitR post"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-brand-light-text">
          Geen media
        </div>
      )}

      <Link
        href={`/post/${post._id}`}
        aria-label={post.description || "Open outfit"}
        className="absolute inset-0 z-10 transition-transform duration-200 active:scale-[0.98]"
      />

      {isVideo && (
        <span className="pointer-events-none absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Creator attribution — makes profiles reachable straight from Explore.
          Kept deliberately small and low-contrast so the Explore grid still
          reads as images first; revealed on hover on pointer devices. */}
      {user?.username && userProfilePath && (
        <Link
          href={userProfilePath}
          className="absolute bottom-1.5 left-1.5 z-20 flex max-w-[calc(100%-0.75rem)] items-center gap-1 rounded-full bg-black/35 py-0.5 pl-0.5 pr-2 text-[11px] font-medium text-white/95 backdrop-blur-sm transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        >
          {user.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profilePicture}
              alt=""
              className="h-4 w-4 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="ml-1" />
          )}
          <span className="truncate">{user.username}</span>
        </Link>
      )}
    </div>
  );
}
