"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CompassIcon, ImageStackIcon } from "./icons";
import {
  getRememberedSharedPost,
  rememberSharedPost,
} from "@/lib/shared-post-memory";

/**
 * Floating liquid-glass navbar shown on both the shared post page and the
 * explore page. Lets someone who landed on a shared outfit link hop into
 * Explore to browse more, and find their way back to the original post.
 *
 * - On a post page: "Outfit" is active, and we remember this post id.
 * - On the explore page: "Verkennen" is active, "Outfit" goes back to the
 *   last remembered shared post (or is hidden if none is known yet).
 */
export default function SharedNavBar({
  activePostId,
  variant = "light",
}: {
  /** Pass the current post id when rendered on /post/[id]. */
  activePostId?: string;
  variant?: "light" | "dark";
}) {
  const router = useRouter();
  // Lazy initializer reads sessionStorage once on mount (client-only;
  // returns null during SSR, which is fine since we only need this on the
  // explore page where there's no post id of our own anyway).
  const [rememberedPostId] = useState<string | null>(() =>
    activePostId ? null : getRememberedSharedPost(),
  );

  useEffect(() => {
    if (activePostId) {
      rememberSharedPost(activePostId);
    }
  }, [activePostId]);

  const isOnPost = Boolean(activePostId);
  const outfitTargetId = activePostId || rememberedPostId;
  const outfitDisabled = !isOnPost && !outfitTargetId;
  const isDark = variant === "dark";

  return (
    <div className="fixed inset-x-0 bottom-[76px] z-40 flex justify-center px-4">
      <nav
        aria-label="OutfitR navigatie"
        className={`flex items-center gap-1.5 rounded-full border p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-2xl ${
          isDark
            ? "border-white/15 bg-white/10"
            : "border-white/40 bg-white/30"
        }`}
      >
        <button
          type="button"
          disabled={outfitDisabled}
          onClick={() => {
            if (!outfitTargetId) return;
            router.push(`/post/${outfitTargetId}`);
          }}
          className={navPillClasses(isOnPost, isDark, outfitDisabled)}
        >
          <ImageStackIcon className="h-[18px] w-[18px]" />
          Outfit
        </button>

        <button
          type="button"
          onClick={() => router.push("/explore")}
          className={navPillClasses(!isOnPost, isDark, false)}
        >
          <CompassIcon className="h-[18px] w-[18px]" />
          Verkennen
        </button>
      </nav>
    </div>
  );
}

function navPillClasses(isActive: boolean, isDark: boolean, disabled: boolean) {
  const base =
    "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95";

  if (disabled) {
    return `${base} ${
      isDark ? "text-white/30" : "text-brand-text/30"
    } cursor-not-allowed`;
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
