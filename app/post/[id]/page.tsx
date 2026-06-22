import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/outfitr-api";
import { getPostUser, getPrimaryMedia } from "@/lib/post-utils";
import PostDetailView from "@/components/PostDetailView";
import AppStoreBar from "@/components/AppStoreBar";
import SharedNavBar from "@/components/SharedNavBar";
import { SITE_NAME } from "@/lib/config";

export const dynamic = "force-dynamic";

type Params = { id: string };

async function fetchPost(id: string) {
  try {
    const response = await getPostById(id);
    return response?.data ?? null;
  } catch (error) {
    console.error(`Failed to load post ${id}`, error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) {
    return { title: `Post not found | ${SITE_NAME}` };
  }

  const user = getPostUser(post);
  const media = getPrimaryMedia(post);
  const title = user?.username
    ? `@${user.username} on ${SITE_NAME}`
    : `Post on ${SITE_NAME}`;
  const description = post.description || "Check out this outfit on OutfitR.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: media?.mediaUrl ? [{ url: media.mediaUrl }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: media?.mediaUrl ? [media.mediaUrl] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-black pb-36">
      <PostDetailView post={post} />
      <SharedNavBar activePostId={id} variant="dark" />
      <AppStoreBar variant="dark" />
    </div>
  );
}
