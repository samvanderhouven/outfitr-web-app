"use client";

const STORAGE_KEY = "outfitr:lastSharedPostId";

/**
 * Remembers which shared post the visitor originally landed on, so the
 * floating navbar's "Outfit" pill can take them back to it after they've
 * wandered off into Explore. Lives in sessionStorage: cleared when the tab
 * closes, scoped per-visitor, no server/account needed (there is no web
 * login).
 */
export function rememberSharedPost(postId: string) {
  if (typeof window === "undefined" || !postId) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, postId);
  } catch {
    // sessionStorage can be unavailable (private mode, etc.) - non-fatal.
  }
}

export function getRememberedSharedPost(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
