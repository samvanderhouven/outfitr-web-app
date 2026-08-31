import type { OutfitrBadge, OutfitrProfile, OutfitrUser } from "./types";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

/**
 * A profile URL segment is either a Mongo ObjectId (the shape mobile already
 * uses for push-notification deep links, `/profile/<userId>`) or a username.
 */
export function isObjectId(handle: string): boolean {
  return OBJECT_ID_RE.test(handle.trim());
}

/**
 * Usernames are stored with their original casing but compared
 * case-insensitively by the backend, and the mobile profile header renders
 * them lowercased with whitespace stripped. We normalise the same way so
 * `/profile/Vincent` and `/profile/vincent` resolve to one canonical URL.
 */
export function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase().replace(/\s/g, "");
}

/** The canonical, shareable path for a user. Prefers the username. */
export function profilePath(user?: Pick<OutfitrUser, "_id" | "username">): string | null {
  if (!user) return null;
  if (user.username?.trim()) return `/profile/${normalizeHandle(user.username)}`;
  if (user._id) return `/profile/${user._id}`;
  return null;
}

/** Name shown in large type. Mobile: `fullName || username`. */
export function getDisplayName(profile?: OutfitrProfile | OutfitrUser): string {
  return profile?.fullName?.trim() || profile?.username?.trim() || "OutfitR user";
}

/** Handle shown under the name. Mobile lowercases and strips spaces. */
export function getHandle(profile?: OutfitrProfile | OutfitrUser): string | null {
  const username = profile?.username?.trim();
  if (!username) return null;
  return normalizeHandle(username);
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
