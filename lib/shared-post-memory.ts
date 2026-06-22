"use client";

// Two separate keys:
// ORIGINAL = the post the visitor first landed on via a share link (never overwritten)
// LAST     = the most recent post they viewed (used for the "Outfit" tab when on Explore)
const ORIGINAL_KEY = "outfitr:originalSharedPostId";

/**
 * Call this ONLY when the visitor arrives via a shared link (i.e. on /post/[id]).
 * We only store it if nothing is stored yet — so it never gets overwritten
 * by posts the user browses to afterwards.
 */
export function rememberSharedPost(postId: string) {
  if (typeof window === "undefined" || !postId) return;
  try {
    // Only set once per session — the original entry point
    if (!window.sessionStorage.getItem(ORIGINAL_KEY)) {
      window.sessionStorage.setItem(ORIGINAL_KEY, postId);
    }
  } catch {
    // sessionStorage unavailable (private mode etc.) — non-fatal
  }
}

export function getRememberedSharedPost(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(ORIGINAL_KEY);
  } catch {
    return null;
  }
}
