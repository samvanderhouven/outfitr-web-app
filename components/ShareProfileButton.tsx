"use client";

import { useState } from "react";
import { ShareIcon } from "./icons";

/**
 * Shares the current profile URL. Uses the native share sheet when available
 * (mobile web, which is where most shared links are opened) and falls back to
 * copying the link. The URL shared is exactly the canonical profile URL, so it
 * deep-links back into the app for anyone who has it installed.
 */
export default function ShareProfileButton({
  username,
  name,
  fullWidth = false,
}: {
  username?: string | null;
  name?: string;
  fullWidth?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    const label = username ? `@${username}` : name || "this creator";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "OutfitR",
          text: `Check out ${label} on OutfitR`,
          url,
        });
        return;
      } catch {
        // Share sheet dismissed — fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — nothing else to do, the URL is in the address bar.
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-secondary-soft active:scale-[0.98] ${
        fullWidth ? "w-full" : ""
      }`}
    >
      <ShareIcon className="h-4 w-4" />
      {copied ? "Link copied" : "Share profile"}
    </button>
  );
}
