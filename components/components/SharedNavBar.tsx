"use client";

import { useEffect, useState } from "react";
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
  // Track which tab is "visually" active so we can animate before navigation
  const [visualActive, setVisualActive] = useState<"outfit" | "explore">(
    activePostId ? "outfit" : "explore"
  );

  useEffect(() => {
    if (activePostId) {
      rememberSharedPost(activePostId);
      setVisualActive("outfit");
    } else {
      setRememberedPostId(getRememberedSharedPost());
      setVisualActive("explore");
    }
  }, [activePostId]);

  const outfitTargetId = activePostId ?? rememberedPostId;
  const showOutfitTab = Boolean(activePostId) || Boolean(rememberedPostId);
  const isDark = variant === "dark";

  const handleOutfitClick = () => {
    if (!outfitTargetId) return;
    setVisualActive("outfit");
    setTimeout(() => router.push(`/post/${outfitTargetId}`), 250);
  };

  const handleExploreClick = () => {
    setVisualActive("explore");
    setTimeout(() => router.push("/explore"), 250);
  };

  const isOutfitActive = visualActive === "outfit";
  const isExploreActive = visualActive === "explore";

  return (
    <div className="fixed inset-x-0 bottom-[76px] z-40 flex justify-center px-4">
      <nav
        aria-label="OutfitR navigation"
        className={`flex items-center gap-1.5 rounded-full border p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-2xl ${
          isDark ? "border-white/15 bg-white/10" : "border-white/40 bg-white/30"
        }`}
      >
        {showOutfitTab && (
          <button
            type="button"
            onClick={handleOutfitClick}
            style={{
              transition: "background-color 250ms ease, color 250ms ease, box-shadow 250ms ease",
              backgroundColor: isOutfitActive ? "var(--color-primary)" : "transparent",
              color: isOutfitActive ? "white" : isDark ? "rgba(255,255,255,0.8)" : "rgba(16,24,40,0.8)",
              boxShadow: isOutfitActive ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
            }}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold active:scale-95"
          >
            <ImageStackIcon className="h-[18px] w-[18px]" />
            Outfit
          </button>
        )}

        <button
          type="button"
          onClick={handleExploreClick}
          style={{
            transition: "background-color 250ms ease, color 250ms ease, box-shadow 250ms ease",
            backgroundColor: isExploreActive ? "var(--color-primary)" : "transparent",
            color: isExploreActive ? "white" : isDark ? "rgba(255,255,255,0.8)" : "rgba(16,24,40,0.8)",
            boxShadow: isExploreActive ? "0 1px 3px rgba(0,0,0,0.2)" : "none",
          }}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold active:scale-95"
        >
          <CompassIcon className="h-[18px] w-[18px]" />
          Explore
        </button>
      </nav>
    </div>
  );
}
