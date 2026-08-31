import { getBadgeMeta } from "@/lib/profile-utils";
import { CrownIcon, StarIcon, SunriseIcon, VerifiedIcon } from "./icons";

const ICONS: Record<string, (props: { className?: string }) => React.ReactElement> = {
  "rising-creator": SunriseIcon,
  "trend-setter": StarIcon,
  "outfitr-verified": VerifiedIcon,
  "partner-creator": CrownIcon,
};

/**
 * Creator badge chip, mirroring the mobile profile header
 * (ViewOthersProfileScreen → renderBadge). Mobile renders it over a photo with
 * a blur, so it uses white-on-glass; on the web profile the header sits on a
 * white surface, so the chip uses the brand palette instead while keeping the
 * same pill shape, icon-then-label layout and tier names.
 */
export default function CreatorBadge({
  badge,
  className = "",
}: {
  badge?: string;
  className?: string;
}) {
  const meta = getBadgeMeta(badge);
  if (!meta) return null;

  const Icon = ICONS[meta.key] ?? StarIcon;
  const isSolid = meta.emphasis === "solid";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${
        isSolid
          ? "border-transparent bg-brand-primary text-white"
          : "border-brand-primary/25 bg-brand-secondary-soft text-brand-primary"
      } ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}
