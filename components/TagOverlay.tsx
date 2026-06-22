"use client";

import type { OutfitrMediaTag } from "@/lib/types";

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

  const handleTagClick = (e: React.MouseEvent, tag: OutfitrMediaTag) => {
    e.stopPropagation();
    const productUrl = tag.productUrl as string | undefined;
    if (!productUrl) return;

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
        const label = tag.brandName || tag.productName || "Brand";
        const clickable = Boolean(tag.productUrl);

        return (
          <div
            key={tag._id || index}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute z-20 -translate-x-1/2 -translate-y-full"
          >
            <button
              type="button"
              disabled={!clickable}
              onClick={(e) => handleTagClick(e, tag)}
              className="flex flex-col items-center disabled:cursor-default"
            >
              {/* Tooltip body — liquid glass like the app */}
              <div
                className="relative flex items-center justify-center overflow-hidden rounded-lg border px-3 py-1.5"
                style={{
                  borderColor: "rgba(255,255,255,0.5)",
                  backgroundColor: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  minWidth: 80,
                  maxWidth: 180,
                }}
              >
                <span
                  className="truncate text-xs font-semibold text-white"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                >
                  {label}
                </span>
              </div>
              {/* Caret pointing down toward the tagged item */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid rgba(255,255,255,0.45)",
                }}
              />
            </button>
          </div>
        );
      })}
    </>
  );
}
