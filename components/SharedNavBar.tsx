"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CompassIcon, ImageStackIcon } from "./icons";
import {
  getRememberedSharedPost,
  rememberSharedPost,
} from "@/lib/shared-post-memory";

/**
 * Pill navbar shown on both the shared post page and the explore page.
 *
 * - On a post page: "Outfit" is active. We store this post id in sessionStorage.
 * - On the explore page: "Explore" is active. "Outfit" goes back to the last
 *   remembered shared post (the one that brought the user to the web app).
 *   If no post was ever visited, "Outfit" is hidden.
 */
export default function SharedNavBar({
  activePostId,
  variant = "light",
}: {
  activePostId?: string;
  variant?: "light" | "dark";
}) {
  const router = useRouter();

  // On the explore page we read the stored post id from sessionStorage.
  const [rememberedPostId, setRememberedPostId] = useState<string | null>(null);

  useEffect(() => {
    if (activePostId) {
      // We're on a post page — save it so Explore can link back.
      rememberSharedPost(activePostId);
    } else {
      // We're on the explore page — read the stored id.
      setRememberedPostId(getRememberedSharedPost());
    }
  }, [activePostId]);

  const isOnPost = Boolean(activePostId);
  const outfitTargetId = activePostId ?? rememberedPostId;
  const isDark = variant === "dark";

  // Don't show "Outfit" tab at all if we have no post to link back to
  // and we're not currently on a post page.
  const showOutfitTab = isOnPost || Boolean(rememberedPostId);

  return (
    <div className="fixed inset-x-0 bottom-[76px] z-40 flex justify-center px-4">
      <nav
        aria-label="OutfitR navigation"
        className={`flex items-center gap-1.5 rounded-full border p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-2xl ${
          isDark
            ? "border-white/15 bg-white/10"
            : "border-white/40 bg-white/30"
        }`}
      >
        {showOutfitTab && (
          <button
            type="button"
            onClick={() => {
              if (outfitTargetId) router.push(`/post/${outfitTargetId}`);
            }}
            className={navPillClasses(isOnPost, isDark, false)}
          >
            <ImageStackIcon className="h-[18px] w-[18px]" />
            Outfit
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push("/explore")}
          className={navPillClasses(!isOnPost, isDark, false)}
        >
          <CompassIcon className="h-[18px] w-[18px]" />
          Explore
        </button>
      </nav>
    </div>
  );
}

function navPillClasses(isActive: boolean, isDark: boolean, disabled: boolean) {
  const base =
    "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95";

  if (disabled) {
    return `${base} ${isDark ? "text-white/30" : "text-brand-text/30"} cursor-not-allowed`;
  }

  if (isActive) {
    return `${base} bg-brand-primary text-white shadow-sm`;
  }

  return `${base} ${
    isDark
      ? "text-white/85 hover:bg-white/10"
      : "text-brand-text/85 hover:bg-white/40"
  }`;
}
