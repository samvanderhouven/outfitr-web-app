"use client";

import { useEffect, useRef } from "react";
import type { OutfitrMediaTag } from "@/lib/types";

function Tag({
  tag,
  index,
  postId,
  mediaIndex,
}: {
  tag: OutfitrMediaTag;
  index: number;
  postId: string;
  mediaIndex: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Spring pop-in animation on mount — matches the app's spring(friction:6, tension:80)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translate(-50%, -100%) scale(0.7)";

    // Stagger each tag slightly
    const delay = index * 60;
    const timer = setTimeout(() => {
      el.style.transition =
        "opacity 180ms ease, transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.opacity = "1";
      el.style.transform = "translate(-50%, -100%) scale(1)";
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = (e: React.MouseEvent) => {
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

  const x = (tag.x_position as number | undefined) ?? 50;
  const y = (tag.y_position as number | undefined) ?? 50;
  const label = tag.brandName || tag.productName || "Brand";
  const clickable = Boolean(tag.productUrl);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -100%) scale(0.7)",
        zIndex: 20,
        opacity: 0,
      }}
    >
      <button
        type="button"
        disabled={!clickable}
        onClick={handleClick}
        className="flex flex-col items-center disabled:cursor-default"
      >
        {/* Liquid glass tooltip body */}
        <div
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "0.5px solid rgba(255,255,255,0.7)",
            borderRadius: "8px",
            padding: "5px 13px",
            minWidth: 70,
            maxWidth: 180,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              display: "block",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </span>
        </div>
        {/* Caret pointing down */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid rgba(255,255,255,0.6)",
          }}
        />
      </button>
    </div>
  );
}

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

  return (
    <>
      {tags.map((tag, index) => (
        <Tag
          key={tag._id || index}
          tag={tag}
          index={index}
          postId={postId}
          mediaIndex={mediaIndex}
        />
      ))}
    </>
  );
}
