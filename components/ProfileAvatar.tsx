import { getInitial } from "@/lib/post-utils";

/**
 * Avatar with the same fallback the mobile app uses: a diagonal
 * #4b5e70 → #a1b8c4 gradient with the first initial in white.
 */
export default function ProfileAvatar({
  src,
  name,
  size = 88,
  className = "",
}: {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const initial = getInitial(name);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ? `${name} profile picture` : "Profile picture"}
        width={size}
        height={size}
        className={`shrink-0 rounded-full bg-brand-secondary object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4b5e70] to-[#a1b8c4] font-semibold text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initial}
    </div>
  );
}
