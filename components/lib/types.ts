export interface OutfitrUser {
  _id: string;
  username?: string;
  fullName?: string;
  profilePicture?: string;
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
