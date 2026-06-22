"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { OutfitrPost } from "@/lib/types";
import { formatCount, getInitial, getPostUser } from "@/lib/post-utils";
import {
  BookmarkIcon,
  ChatIcon,
  ChevronLeft,
  ChevronRight,
  HeartIcon,
  PlayIcon,
  ShareIcon,
} from "./icons";
import TagOverlay from "./TagOverlay";
import { APP_STORE_URL } from "@/lib/config";

function GlassButton({
  children,
  onClick,
  ariaLabel,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-transform active:scale-90 ${className}`}
    >
      {children}
    </button>
  );
}

export default function PostDetailView({ post }: { post: OutfitrPost }) {
  const user = getPostUser(post);
  const media = post.media || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [liked, setLiked] = useState(Boolean(post.isLikedByCurrentUser));
  const [saved, setSaved] = useState(
    Boolean(post.isSavedByCurrentUser ?? post.savedByCurrentUser),
  );
  // Tags visible by default on open, toggled by single tap
  const [showTags, setShowTags] = useState(true);
  const clickedRef = useRef(false);
  const lastTapRef = useRef<number>(0);
  const doubleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initials = getInitial(user?.fullName || user?.username);
  const currentMedia = media[activeIndex];
  const isVideo = currentMedia?.mediaType === "video";

  // Register a single "click" against the post when the page is actually viewed
  useEffect(() => {
    if (clickedRef.current) return;
    clickedRef.current = true;
    fetch(`/api/post-click/${post._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaIndex: 0,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
    }).catch(() => {});
  }, [post._id]);

  const triggerLikeAnimation = useCallback(() => {
    setShowHeart(true);
    window.setTimeout(() => setShowHeart(false), 700);
  }, []);

  const triggerLike = useCallback(() => {
    if (!liked) {
      triggerLikeAnimation();
    }
    setLiked((v) => !v);
    setShowSharePrompt(true);
  }, [liked, triggerLikeAnimation]);

  // Double-tap to like on the image area
  const handleImageTap = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected → like
      if (doubleTapTimerRef.current) {
        clearTimeout(doubleTapTimerRef.current);
        doubleTapTimerRef.current = null;
      }
      if (!liked) {
        triggerLikeAnimation();
        setLiked(true);
        setShowSharePrompt(true);
      }
      lastTapRef.current = 0;
    } else {
      // First tap → schedule single-tap action (toggle tags)
      lastTapRef.current = now;
      doubleTapTimerRef.current = setTimeout(() => {
        setShowTags((v) => !v);
        doubleTapTimerRef.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  }, [liked, triggerLikeAnimation]);

  const handleSave = () => {
    setSaved((v) => !v);
    setShowSharePrompt(true);
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "OutfitR",
          text: "Check out this outfit on OutfitR",
          url,
        });
        return;
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShowSharePrompt(true);
    } catch {
      setShowSharePrompt(true);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-black sm:max-w-lg">
      {/* Full-screen media — fills viewport like the app reel */}
      <div
        className="relative flex-1 overflow-hidden bg-black"
        style={{ minHeight: "100svh" }}
        onClick={handleImageTap}
      >
        {currentMedia?.mediaUrl ? (
          isVideo ? (
            <video
              key={currentMedia.mediaUrl}
              src={currentMedia.mediaUrl}
              className="absolute inset-0 h-full w-full object-cover"
              controls
              playsInline
              autoPlay
              muted
              loop
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentMedia.mediaUrl}
              alt={post.description || "OutfitR post"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/60">
            No media available
          </div>
        )}

        {/* Media nav arrows for multi-image posts */}
        {media.length > 1 && (
          <>
            {activeIndex > 0 && (
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => Math.max(0, i - 1));
                }}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm"
              >
                <ChevronLeft />
              </button>
            )}
            {activeIndex < media.length - 1 && (
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((i) => Math.min(media.length - 1, i + 1));
                }}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm"
              >
                <ChevronRight />
              </button>
            )}
            <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {media.map((m, i) => (
                <span
                  key={m._id || i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {isVideo && (
          <span className="pointer-events-none absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white">
            <PlayIcon className="h-3.5 w-3.5" />
          </span>
        )}

        {/* Tagged brands / shoppable items — shown by default, toggled by single tap */}
        {showTags && (
          <TagOverlay
            tags={currentMedia?.tags}
            postId={post._id}
            mediaIndex={activeIndex}
          />
        )}

        {/* Top overlay — "Explore" label + back arrow */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-4 pt-12">
          <GlassButton
            ariaLabel="Back to Explore"
            onClick={(e) => {
              (e as React.MouseEvent).stopPropagation();
              window.location.href = "/explore";
            }}
            className="h-10 w-10"
          >
            {/* Back chevron */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </GlassButton>
          <span className="text-base font-semibold text-white drop-shadow-sm">
            Explore
          </span>
        </div>

        {/* Heart burst on double-tap like */}
        {showHeart && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <HeartIcon
              filled
              className="h-20 w-20 animate-heart-pop text-brand-secondary drop-shadow-lg"
            />
          </div>
        )}

        {/* Right action rail */}
        <div
          className="absolute right-3 bottom-44 z-20 flex flex-col items-center gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Like"
            onClick={triggerLike}
            className="flex flex-col items-center gap-1"
          >
            <GlassButton ariaLabel="Like" className="h-11 w-11">
              <HeartIcon
                filled={liked}
                className={liked ? "h-6 w-6 text-brand-secondary" : "h-6 w-6"}
              />
            </GlassButton>
            <span className="text-xs font-medium text-white">
              {formatCount((post.likeCount || 0) + (liked && !post.isLikedByCurrentUser ? 1 : 0))}
            </span>
          </button>

          <button
            type="button"
            aria-label="Comments"
            onClick={() => setShowSharePrompt(true)}
            className="flex flex-col items-center gap-1"
          >
            <GlassButton ariaLabel="Comments" className="h-11 w-11">
              <ChatIcon className="h-6 w-6" />
            </GlassButton>
            <span className="text-xs font-medium text-white">
              {formatCount(post.commentCount)}
            </span>
          </button>

          <button
            type="button"
            aria-label="Share"
            onClick={handleShare}
            className="flex flex-col items-center gap-1"
          >
            <GlassButton ariaLabel="Share" className="h-11 w-11">
              <ShareIcon className="h-5 w-5" />
            </GlassButton>
          </button>

          <button
            type="button"
            aria-label="Save"
            onClick={handleSave}
            className="flex flex-col items-center gap-1"
          >
            <GlassButton ariaLabel="Save" className="h-11 w-11">
              <BookmarkIcon
                filled={saved}
                className={saved ? "h-5 w-5 text-brand-secondary" : "h-5 w-5"}
              />
            </GlassButton>
          </button>
        </div>

        {/* Bottom overlay: user + caption */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-6 pt-16"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2.5">
            {user?.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profilePicture}
                alt={user.username || "User"}
                className="h-9 w-9 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#4b5e70] to-[#a1b8c4] text-sm font-semibold text-white">
                {initials}
              </div>
            )}
            <span className="text-sm font-semibold text-white">
              {user?.username ? `@${user.username}` : "OutfitR user"}
            </span>
          </div>
          {post.description && (
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/90">
              {post.description}
            </p>
          )}
        </div>
      </div>

      {/* Inline nudge after an interaction attempt */}
      {showSharePrompt && (
        <div
          className="fixed inset-x-0 bottom-[140px] z-50 mx-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/15 bg-[#10161d]/95 p-4 text-center shadow-xl backdrop-blur-md sm:max-w-lg"
          role="dialog"
        >
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Image
              src="/brand/logo-mark.png"
              alt="OutfitR"
              width={28}
              height={28}
              className="rounded-md"
            />
          </div>
          <p className="text-sm font-medium text-white">
            Open the app to like, comment and save
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-secondary px-4 py-2 text-sm font-semibold text-brand-primary-dark"
            >
              Open app
            </a>
            <button
              type="button"
              onClick={() => setShowSharePrompt(false)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80"
            >
              Not now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
