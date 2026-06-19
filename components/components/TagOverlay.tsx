"use client";

import type { OutfitrMediaTag } from "@/lib/types";
import { TagIcon } from "./icons";

export default function TagOverlay({
  tags,
  postId,
  mediaIndex,
}: {
  tags?: OutfitrMediaTag[];
  postId: string;
  mediaIndex: number;
}) {
  if (!tags || tags.length === 0) return null;

  const handleTagClick = (tag: OutfitrMediaTag) => {
    const productUrl = tag.productUrl as string | undefined;
    if (!productUrl) return;

    // Best-effort click tracking, mirroring the app's affiliate click
    // registration. Never block the redirect on this.
    fetch(`/api/post-click/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId: tag._id,
        mediaIndex,
        metaData: {
          brandName: tag.brandName,
          productName: tag.productName,
          destinationUrl: productUrl,
        },
      }),
    }).catch(() => {});

    window.open(productUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {tags.map((tag, index) => {
        const x = (tag.x_position as number | undefined) ?? 50;
        const y = (tag.y_position as number | undefined) ?? 50;
        const label = tag.brandName || tag.productName || "Merk";
        const clickable = Boolean(tag.productUrl);

        return (
          <div
            key={tag._id || index}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <button
              type="button"
              disabled={!clickable}
              onClick={() => handleTagClick(tag)}
              className="flex items-center gap-1 rounded-full border border-white/50 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-md transition-transform active:scale-95 disabled:active:scale-100"
            >
              <TagIcon className="h-3 w-3 shrink-0" />
              <span className="max-w-[140px] truncate">{label}</span>
            </button>
          </div>
        );
      })}
    </>
  );
}
