import type { OutfitrProfile } from "@/lib/types";
import { formatCount } from "@/lib/post-utils";
import { getDisplayName, getHandle } from "@/lib/profile-utils";
import CreatorBadge from "./CreatorBadge";
import ProfileAvatar from "./ProfileAvatar";
import ShareProfileButton from "./ShareProfileButton";

function Stat({ value, label }: { value?: number; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2">
      <span className="text-lg font-bold text-brand-text sm:text-xl">
        {typeof value === "number" ? formatCount(value) : "—"}
      </span>
      <span className="mt-0.5 text-xs text-brand-light-text">{label}</span>
    </div>
  );
}

/**
 * Public profile header — the web counterpart of the mobile
 * ViewOthersProfileScreen `ProfileHeader`: avatar, display name, @handle,
 * creator badge, bio, and the posts / followers / following stats bar.
 *
 * The mobile Follow button is intentionally replaced by Share, since a
 * logged-out web visitor cannot follow; following happens in the app.
 */
export default function ProfileHeader({
  profile,
  /** Hidden when the counts are unknown (resolved via the search fallback). */
  showStats = true,
}: {
  profile: OutfitrProfile;
  showStats?: boolean;
}) {
  const displayName = getDisplayName(profile);
  const handle = getHandle(profile);

  return (
    <header className="px-4 pt-5 sm:px-6">
      <div className="flex items-start gap-4 sm:gap-6">
        <ProfileAvatar
          src={profile.profilePicture}
          name={displayName}
          size={88}
          className="sm:!h-28 sm:!w-28 sm:!text-4xl"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
            <h1 className="font-display text-xl font-semibold leading-tight text-brand-text sm:text-3xl">
              {displayName}
            </h1>
            {/* NOTE: deliberately no "verified" checkmark next to the name.
                In the user model `isVerified` is synchronised with
                `isEmailVerified` by a pre-validate hook — it means "confirmed
                their email address", not "verified creator". Showing it here
                would give a verification mark to nearly every account. The
                only real creator status is `badge`, which is what the mobile
                profile screen renders too. */}
            <CreatorBadge badge={profile.badge} />
          </div>

          {handle && (
            <p className="truncate text-sm text-brand-light-text">@{handle}</p>
          )}
        </div>

        {/* Share sits where the mobile screen puts Follow: top-right of the
            header row. A logged-out visitor can't follow, so this is the
            equivalent primary action. */}
        <div className="hidden shrink-0 pt-1 sm:block">
          <ShareProfileButton username={handle} name={displayName} />
        </div>
      </div>

      {profile.bio && (
        <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-brand-light-text">
          {profile.bio}
        </p>
      )}

      <div className="mt-4 sm:hidden">
        <ShareProfileButton username={handle} name={displayName} fullWidth />
      </div>

      {showStats && (
        <div className="mt-5 flex items-stretch border-y border-brand-border py-3">
          <Stat value={profile.totalPosts} label="Posts" />
          <span aria-hidden="true" className="my-1 w-px bg-brand-border" />
          <Stat value={profile.totalFollowers} label="Followers" />
          <span aria-hidden="true" className="my-1 w-px bg-brand-border" />
          <Stat value={profile.totalFollowing} label="Following" />
        </div>
      )}
    </header>
  );
}
