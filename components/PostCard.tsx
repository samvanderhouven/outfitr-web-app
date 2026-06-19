"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { OutfitrPost } from "@/lib/types";
import { getPrimaryMedia } from "@/lib/post-utils";

export default function PostCard({ post }: { post: OutfitrPost }) {
  const router = useRouter();
  const media = getPrimaryMedia(post);
  const isVideo = media?.mediaType === "video";
  const mediaUrl = media?.mediaUrl;

  return (
    <button
      type="button"
      onClick={() => router.push(`/post/${post._id}`)}
      className="group relative block w-full overflow-hidden rounded-2xl bg-brand-secondary-soft text-left transition-transform duration-200 active:scale-[0.98]"
    >
      {mediaUrl ? (
        isVideo ? (
          <video
            src={mediaUrl}
            className="h-auto w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt={post.description || "OutfitR post"}
            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        )
      ) : (
        <div className="flex aspect-[3/4] w-full items-center justify-center text-sm text-brand-light-text">
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
