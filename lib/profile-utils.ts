import type { OutfitrBadge, OutfitrProfile, OutfitrUser } from "./types";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

/**
 * Turn a Next.js dynamic route segment back into the real value.
 *
 * IMPORTANT: App Router hands `params` to us **percent-encoded** — the segment
 * of `/profile/Tim%20Pennock` arrives as the 13-character string
 * `"Tim%20Pennock"`, not as `"Tim Pennock"`. Every username in this database
 * that contains a space (and there are many) therefore has to be decoded here
 * before it is looked up, compared or re-encoded. Skipping this step double
 * encodes the value (`encodeURIComponent("Tim%20Pennock") ===
 * "Tim%2520Pennock"`), the API answers 404, and a creator who really exists is
 * shown "this profile could not be found".
 *
 * Malformed input (a lone `%`, a truncated escape) is returned unchanged
 * rather than throwing, so a hand-typed URL degrades to "not found" instead of
 * a 500.
 */
export function decodeHandle(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * A profile URL segment is either a Mongo ObjectId (the shape mobile already
 * uses for push-notification deep links, `/profile/<userId>`) or a username.
 */
export function isObjectId(handle: string): boolean {
  return OBJECT_ID_RE.test(handle.trim());
}

/**
 * Usernames are compared case-insensitively by the backend, so casing is the
 * only thing we normalise for lookup.
 *
 * IMPORTANT: whitespace is *not* stripped here. The mobile profile header
 * renders `@{username.toLowerCase().replace(/\s/g,'')}` — but that is a
 * cosmetic label, not an identifier. Real usernames in this database do
 * contain spaces ("Tieme van der Meer", "Sem Coumans"), and stripping them
 * produces a handle that can never be resolved back to a user.
 */
export function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase();
}

/**
 * Can this username be used as a clean URL segment?
 *
 * Only usernames made of letters, digits, dot, underscore and hyphen get a
 * pretty `/profile/<username>` URL. Anything with spaces, accents, an @ or
 * other punctuation (all of which occur in the live user table) is addressed
 * by id instead — that always resolves, needs no escaping, and matches the
 * `/profile/<userId>` shape the mobile app already uses for push links.
 */
export function isUrlSafeUsername(username?: string): boolean {
  const trimmed = username?.trim();
  if (!trimmed) return false;
  return /^[a-zA-Z0-9._-]{1,64}$/.test(trimmed);
}

/**
 * The canonical, shareable path for a user. Prefers a pretty username URL and
 * falls back to the id when the username cannot be one.
 */
export function profilePath(user?: Pick<OutfitrUser, "_id" | "username">): string | null {
  if (!user) return null;
  if (isUrlSafeUsername(user.username)) {
    return `/profile/${normalizeHandle(user.username!)}`;
  }
  if (user._id) return `/profile/${user._id}`;
  return null;
}

/** Name shown in large type. Mobile: `fullName || username`. */
export function getDisplayName(profile?: OutfitrProfile | OutfitrUser): string {
  return profile?.fullName?.trim() || profile?.username?.trim() || "OutfitR user";
}

/**
 * Handle shown under the name — cosmetic only, mirroring the mobile header,
 * which lowercases and strips spaces. Never use this to build a URL; use
 * `profilePath` for that.
 */
export function getHandle(profile?: OutfitrProfile | OutfitrUser): string | null {
  const username = profile?.username?.trim();
  if (!username) return null;
  return username.toLowerCase().replace(/\s/g, "");
}

export interface BadgeMeta {
  key: OutfitrBadge;
  label: string;
  /** Verified-style badges get the filled treatment. */
  emphasis: "solid" | "outline";
}

const BADGES: Record<string, BadgeMeta> = {
  "rising-creator": {
    key: "rising-creator",
    label: "Rising Creator",
    emphasis: "outline",
  },
  "trend-setter": {
    key: "trend-setter",
    label: "Trendsetter",
    emphasis: "outline",
  },
  "outfitr-verified": {
    key: "outfitr-verified",
    label: "Outfitr Verified",
    emphasis: "solid",
  },
  "partner-creator": {
    key: "partner-creator",
    label: "Partner Creator",
    emphasis: "solid",
  },
};

/**
 * Resolve a badge to its display metadata. Returns null for `none`, an empty
 * value, or any tier the web app does not know about yet — so a new backend
 * tier degrades to "no badge" rather than rendering a raw slug.
 */
export function getBadgeMeta(badge?: string): BadgeMeta | null {
  if (!badge || badge === "none") return null;
  return BADGES[badge] ?? null;
}
