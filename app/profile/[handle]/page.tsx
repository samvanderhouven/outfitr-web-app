import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  OutfitrApiError,
  getProfileByHandle,
  getUserPosts,
} from "@/lib/outfitr-api";
import { getDisplayName, getHandle, normalizeHandle } from "@/lib/profile-utils";
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

async function loadProfile(handle: string) {
  try {
    return await getProfileByHandle(handle);
  } catch (error) {
    console.error(`Failed to load profile ${handle}`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const result = await loadProfile(handle);

  if (!result) {
    return { title: `Profile not found | ${SITE_NAME}` };
  }

  const { profile } = result;
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
      canonical: username ? `/profile/${username}` : `/profile/${profile._id}`,
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
  const result = await loadProfile(handle);

  if (!result) notFound();

  const { profile, source } = result;
  const username = getHandle(profile);

  // Keep one canonical URL: `/profile/<username>`. Ids and mixed-case handles
  // (both of which stay valid, e.g. push-notification links using the user id)
  // redirect to it so shares and OG scrapes always converge on one address.
  if (username && normalizeHandle(handle) !== username) {
    redirect(`/profile/${username}`);
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

      <SharedNavBar activeProfileHandle={username ?? profile._id} />
      <AppStoreBar />
    </div>
  );
}
