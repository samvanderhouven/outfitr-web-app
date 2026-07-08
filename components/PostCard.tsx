"use client";

import { useRouter } from "next/navigation";
import type { OutfitrPost } from "@/lib/types";
import { getPrimaryMedia } from "@/lib/post-utils";

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
  const router = useRouter();
  const media = getPrimaryMedia(post);
  const isVideo = media?.mediaType === "video";
  const mediaUrl = media?.mediaUrl;
  const ratio = ratioFor(post._id);

  return (
    <button
      type="button"
      onClick={() => router.push(`/post/${post._id}`)}
      className="group relative block w-full overflow-hidden rounded-2xl bg-brand-secondary-soft text-left transition-transform duration-200 active:scale-[0.98]"
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

      {isVideo && (
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </button>
  );
}
