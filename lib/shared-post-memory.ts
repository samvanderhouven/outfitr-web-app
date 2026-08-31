"use client";

// Remembers the entry point of a visitor who arrived via a shared link, so the
// floating nav can offer a way back to it while they browse.
//
// ORIGINAL_KEY  = the post the visitor first landed on (never overwritten)
// PROFILE_KEY   = the profile the visitor first landed on, or last opened
const ORIGINAL_KEY = "outfitr:originalSharedPostId";
const PROFILE_KEY = "outfitr:originalSharedProfile";

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

/**
 * Called on /profile/[handle]. Unlike the post entry point this one IS
 * refreshed, so the Profile tab always points at the creator the visitor is
 * currently exploring.
 */
export function rememberSharedProfile(handle: string) {
  if (typeof window === "undefined" || !handle) return;
  try {
    window.sessionStorage.setItem(PROFILE_KEY, handle);
  } catch {
    // sessionStorage unavailable (private mode etc.) — non-fatal
  }
}

export function getRememberedSharedProfile(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(PROFILE_KEY);
  } catch {
    return null;
  }
}
