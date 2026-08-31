"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CompassIcon, ImageStackIcon, ProfileIcon } from "./icons";
import {
  getRememberedSharedPost,
  getRememberedSharedProfile,
  rememberSharedPost,
  rememberSharedProfile,
} from "@/lib/shared-post-memory";

type TabKey = "outfit" | "profile" | "explore";

export default function SharedNavBar({
  activePostId,
  activeProfileHandle,
  variant = "light",
}: {
  activePostId?: string;
  activeProfileHandle?: string;
  variant?: "light" | "dark";
}) {
  const router = useRouter();
  const [rememberedPostId, setRememberedPostId] = useState<string | null>(null);
  const [rememberedProfile, setRememberedProfile] = useState<string | null>(
    null,
  );

  // Refs to measure the pill buttons so we can slide the indicator
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Partial<Record<TabKey, HTMLButtonElement | null>>>({});
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  useEffect(() => {
    if (activePostId) rememberSharedPost(activePostId);
    if (activeProfileHandle) rememberSharedProfile(activeProfileHandle);

    // Read back whichever entry points we are not currently sitting on.
    if (!activePostId) setRememberedPostId(getRememberedSharedPost());
    if (!activeProfileHandle) setRememberedProfile(getRememberedSharedProfile());
  }, [activePostId, activeProfileHandle]);

  const isOnPost = Boolean(activePostId);
  const isOnProfile = Boolean(activeProfileHandle);
  const activeTab: TabKey = isOnPost
    ? "outfit"
    : isOnProfile
      ? "profile"
      : "explore";

  const outfitTargetId = activePostId ?? rememberedPostId;
  const profileTarget = activeProfileHandle ?? rememberedProfile;
  const isDark = variant === "dark";

  const tabs: Array<{
    key: TabKey;
    label: string;
    Icon: (props: { className?: string }) => React.ReactElement;
    href: string;
  }> = [];

  if (outfitTargetId) {
    tabs.push({
      key: "outfit",
      label: "Outfit",
      Icon: ImageStackIcon,
      href: `/post/${outfitTargetId}`,
    });
  }
  if (profileTarget) {
    tabs.push({
      key: "profile",
      label: "Profile",
      Icon: ProfileIcon,
      href: `/profile/${profileTarget}`,
    });
  }
  tabs.push({
    key: "explore",
    label: "Explore",
    Icon: CompassIcon,
    href: "/explore",
  });

  // Measure the active pill and set the sliding indicator position.
  // Layout effect so the indicator is placed before the first paint.
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeTab];
      const parent = navRef.current;
      if (!el || !parent) return;
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: elRect.left - parentRect.left,
        width: elRect.width,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTab, tabs.length]);

  return (
    <div className="fixed inset-x-0 bottom-[76px] z-40 flex justify-center px-4">
      <nav
        ref={navRef}
        aria-label="OutfitR navigation"
        className={`relative flex items-center rounded-full border p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-2xl ${
          isDark ? "border-white/15 bg-white/10" : "border-white/40 bg-white/30"
        }`}
      >
        {/* Sliding active indicator */}
        {indicatorStyle.width > 0 && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-full bg-brand-primary shadow-sm"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              transition:
                "left 280ms cubic-bezier(0.34, 1.2, 0.64, 1), width 280ms cubic-bezier(0.34, 1.2, 0.64, 1)",
            }}
          />
        )}

        {tabs.map(({ key, label, Icon, href }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              ref={(node) => {
                tabRefs.current[key] = node;
              }}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => router.push(href)}
              className={pillClasses(isActive, isDark)}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function pillClasses(isActive: boolean, isDark: boolean) {
  const base =
    "relative z-10 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 active:scale-95 sm:px-5";
  if (isActive) return `${base} text-white`;
  return `${base} ${isDark ? "text-white/80" : "text-brand-text/80"}`;
}
