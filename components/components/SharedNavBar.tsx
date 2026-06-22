"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CompassIcon, ImageStackIcon } from "./icons";
import {
  getRememberedSharedPost,
  rememberSharedPost,
} from "@/lib/shared-post-memory";

export default function SharedNavBar({
  activePostId,
  variant = "light",
}: {
  activePostId?: string;
  variant?: "light" | "dark";
}) {
  const router = useRouter();
  const [rememberedPostId, setRememberedPostId] = useState<string | null>(null);

  // Refs to measure the two pill buttons so we can slide the indicator
  const outfitRef = useRef<HTMLButtonElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  useEffect(() => {
    if (activePostId) {
      rememberSharedPost(activePostId);
    } else {
      setRememberedPostId(getRememberedSharedPost());
    }
  }, [activePostId]);

  const isOnPost = Boolean(activePostId);
  const outfitTargetId = activePostId ?? rememberedPostId;
  const showOutfitTab = isOnPost || Boolean(rememberedPostId);
  const isDark = variant === "dark";

  // Measure the active pill and set the sliding indicator position
  useEffect(() => {
    const activeRef = isOnPost ? outfitRef : exploreRef;
    const el = activeRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - parentRect.left,
      width: elRect.width,
    });
  }, [isOnPost, rememberedPostId]);

  return (
    <div className="fixed inset-x-0 bottom-[76px] z-40 flex justify-center px-4">
      <nav
        aria-label="OutfitR navigation"
        className={`relative flex items-center rounded-full border p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-2xl ${
          isDark
            ? "border-white/15 bg-white/10"
            : "border-white/40 bg-white/30"
        }`}
      >
        {/* Sliding active indicator */}
        {indicatorStyle.width > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-full bg-brand-primary shadow-sm"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              transition: "left 280ms cubic-bezier(0.34, 1.2, 0.64, 1), width 280ms cubic-bezier(0.34, 1.2, 0.64, 1)",
            }}
          />
        )}

        {showOutfitTab && (
          <button
            ref={outfitRef}
            type="button"
            onClick={() => {
              if (outfitTargetId) router.push(`/post/${outfitTargetId}`);
            }}
            className={pillClasses(isOnPost, isDark)}
          >
            <ImageStackIcon className="h-[18px] w-[18px]" />
            Outfit
          </button>
        )}

        <button
          ref={exploreRef}
          type="button"
          onClick={() => router.push("/explore")}
          className={pillClasses(!isOnPost, isDark)}
        >
          <CompassIcon className="h-[18px] w-[18px]" />
          Explore
        </button>
      </nav>
    </div>
  );
}

function pillClasses(isActive: boolean, isDark: boolean) {
  const base =
    "relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 active:scale-95";
  if (isActive) return `${base} text-white`;
  return `${base} ${isDark ? "text-white/80" : "text-brand-text/80"}`;
}
