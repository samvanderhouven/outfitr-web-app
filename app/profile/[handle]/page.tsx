import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  OutfitrApiError,
  ProfileLookupError,
  getProfileByHandle,
  getUserPosts,
} from "@/lib/outfitr-api";
import {
  getDisplayName,
  getHandle,
  isUrlSafeUsername,
  normalizeHandle,
  profilePath,
} from "@/lib/profile-utils";
import ProfileUnavailable from "@/components/ProfileUnavailable";
import type { OutfitrPost } from "@/lib/types";
import SiteHeader from "@/components/SiteHeader";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileGrid from "@/components/ProfileGrid";
import SharedNavBar from "@/components/SharedNavBar";
import AppStoreBar from "@/components/AppStoreBar";
import { SITE_NAME } from "@/lib/config";

export const dynamic = "force-dynamic";

type Params = { handle: string };

const PAGE_SIZE = 24;

type LoadResult =
  | { ok: true; result: Awaited<ReturnType<typeof getProfileByHandle>> }
  | { ok: false; reason: "not-found" | "unavailable" };

async function loadProfile(handle: string): Promise<LoadResult> {
  try {
    return { ok: true, result: await getProfileByHandle(handle) };
  } catch (error) {
    if (error instanceof ProfileLookupError) {
      return { ok: false, reason: error.reason };
    }
    // Network/parse failure — we cannot claim the profile doesn't exist.
    console.error(`Failed to load profile ${handle}`, error);
    return { ok: false, reason: "unavailable" };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const loaded = await loadProfile(handle);

  if (!loaded.ok) {
    // layout.tsx already appends "| OutfitR" via its title template.
    return { title: "Profile" };
  }

  const { profile } = loaded.result;
  const displayName = getDisplayName(profile);
  const username = getHandle(profile);
  const title = username
    ? `@${username} on ${SITE_NAME}`
    : `${displayName} on ${SITE_NAME}`;
  const description =
    profile.bio?.trim() ||
    `See ${displayName}'s outfits and shop the pieces on OutfitR.`;
  const image = profile.profilePicture;

  return {
    title,
    description,
    alternates: {
      canonical:
        profilePath(profile) ?? `/profile/${encodeURIComponent(handle)}`,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { handle } = await params;
  const loaded = await loadProfile(handle);

  if (!loaded.ok) {
    // Only a reachable endpoint saying "no such user" is a 404. When the
    // profile endpoint is still auth-gated we cannot tell, and showing "this
    // profile doesn't exist" for a creator who does exist is far worse than
    // saying we can't load it right now.
    if (loaded.reason === "not-found") notFound();
    return <ProfileUnavailable handle={handle} />;
  }

  const { profile, source } = loaded.result;

  // Keep one canonical URL. A username only becomes the canonical URL when it
  // is URL-safe — usernames with spaces or punctuation stay on their id URL,
  // which always resolves and needs no escaping.
  const canonicalSegment = isUrlSafeUsername(profile.username)
    ? normalizeHandle(profile.username!)
    : null;

  if (canonicalSegment && normalizeHandle(handle) !== canonicalSegment) {
    redirect(`/profile/${canonicalSegment}`);
  }

  // Posts are fetched by id — it is the identifier the posts endpoint accepts
  // on every backend build, whereas username support is newer.
  const postsHandle = profile._id || handle;

  let posts: OutfitrPost[] = [];
  let nextCursor: string | null = null;
  let hasMore = false;
  let postsUnavailable = false;

  if (!profile.isPrivate) {
    try {
      const response = await getUserPosts(postsHandle, { limit: PAGE_SIZE });
      posts = response.posts;
      nextCursor = response.nextCursor;
      hasMore = response.hasMore;
    } catch (error) {
      // An auth-gated posts endpoint is a deployment state, not a user error —
      // surface it as "couldn't load", never as "no outfits".
      postsUnavailable =
        error instanceof OutfitrApiError ? !error.isNotFound : true;
      console.error(`Failed to load posts for profile ${handle}`, error);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-36">
      <SiteHeader />

      <main className="mx-auto max-w-4xl">
        <ProfileHeader
          profile={profile}
          // The public search fallback carries no counters — showing three
          // em-dashes would read as broken, so the stats bar is hidden instead.
          showStats={source === "profile-api"}
        />

        <div className="mt-4">
          <ProfileGrid
            handle={postsHandle}
            initialPosts={posts}
            initialNextCursor={nextCursor}
            initialHasMore={hasMore}
            isPrivate={Boolean(profile.isPrivate)}
            postsUnavailable={postsUnavailable}
          />
        </div>
      </main>

      <SharedNavBar
        activeProfileHandle={canonicalSegment ?? profile._id}
      />
      <AppStoreBar />
    </div>
  );
}
