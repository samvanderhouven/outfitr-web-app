/**
 * Creator badge tiers, mirrored from the backend
 * (src/config/creatorBadge.config.js — CREATOR_BADGE_ORDER).
 */
export type OutfitrBadge =
  | "none"
  | "rising-creator"
  | "trend-setter"
  | "outfitr-verified"
  | "partner-creator";

export interface OutfitrUser {
  _id: string;
  username?: string;
  /**
   * The backend user model has no `fullName` column — the mobile app reads
   * `fullName` with a fallback to `username`. We keep the field so the same
   * display logic works if it is ever added.
   */
  fullName?: string;
  profilePicture?: string;
  isVerified?: boolean;
  badge?: OutfitrBadge | string;
}

/**
 * Public profile payload — the subset of `GET /profile/get-profile/:handle`
 * that a logged-out web visitor is allowed to see. Deliberately does NOT
 * include `email`, `accountType` or notification settings.
 */
export interface OutfitrProfile extends OutfitrUser {
  bio?: string;
  totalPosts?: number;
  totalFollowers?: number;
  totalFollowing?: number;
  /** True when the profile is private and its posts must not be listed. */
  isPrivate?: boolean;
}

export interface UserPostsResponse {
  posts: OutfitrPost[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface OutfitrMediaTag {
  _id?: string;
  x_position?: number;
  y_position?: number;
  brandName?: string;
  productName?: string;
  productUrl?: string;
  [key: string]: unknown;
}

export interface OutfitrMedia {
  _id?: string;
  mediaType?: "photo" | "video" | string;
  mediaUrl?: string;
  tags?: OutfitrMediaTag[];
}

export interface OutfitrPost {
  _id: string;
  description?: string;
  caption?: string;
  media?: OutfitrMedia[];
  userId?: OutfitrUser | string;
  likeCount?: number;
  commentCount?: number;
  isLikedByCurrentUser?: boolean;
  isSavedByCurrentUser?: boolean;
  savedByCurrentUser?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ExploreResponse {
  success?: boolean;
  message?: string;
  data?: {
    posts?: OutfitrPost[];
    nextCursor?: string | null;
    hasMore?: boolean;
  };
}

export interface PostByIdResponse {
  success?: boolean;
  message?: string;
  data?: OutfitrPost;
}
