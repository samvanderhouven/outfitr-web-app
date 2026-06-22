import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import AppStoreBar from "@/components/AppStoreBar";
import SharedNavBar from "@/components/SharedNavBar";
import ExploreFeed from "@/components/ExploreFeed";
import { getExplorePosts } from "@/lib/outfitr-api";
import { SITE_DESCRIPTION } from "@/lib/config";

export const metadata: Metadata = {
  title: "Explore | OutfitR",
  description: SITE_DESCRIPTION,
};

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  let posts: Awaited<ReturnType<typeof getExplorePosts>>["data"] = {
    posts: [],
    nextCursor: null,
    hasMore: false,
  };
  let loadError = false;

  try {
    const response = await getExplorePosts({ limit: 12 });
    posts = response?.data ?? posts;
  } catch (error) {
    console.error("Failed to load explore feed", error);
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-brand-bg pb-36">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-brand-text sm:text-3xl">
            Explore
          </h1>
          <p className="mt-1 text-sm text-brand-light-text">
            Style inspiration from the OutfitR community.
          </p>
        </div>

        {loadError ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-brand-border bg-white py-20 text-center">
            <p className="font-display text-xl text-brand-text">
              Temporarily unavailable
            </p>
            <p className="max-w-xs text-sm text-brand-light-text">
              We couldn&apos;t load the explore page. Please try again, or open the app.
            </p>
          </div>
        ) : (
          <ExploreFeed
            initialPosts={posts?.posts ?? []}
            initialNextCursor={posts?.nextCursor ?? null}
            initialHasMore={Boolean(posts?.hasMore)}
          />
        )}
      </main>

      <SharedNavBar />
      <AppStoreBar />
    </div>
  );
}
