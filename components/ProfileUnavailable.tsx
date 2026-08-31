import Link from "next/link";
import SiteHeader from "./SiteHeader";
import AppStoreBar from "./AppStoreBar";
import { APP_STORE_URL } from "@/lib/config";

/**
 * Shown when we could not determine whether a profile exists — currently the
 * case while `GET /profile/get-profile/:id` still requires a token and the
 * public search fallback did not surface this user.
 *
 * Deliberately NOT a 404: the creator almost certainly exists, and telling a
 * visitor who followed a creator's shared link that the profile does not exist
 * is worse than admitting we cannot load it. The page stays useful — it offers
 * the app and the Explore feed.
 */
export default function ProfileUnavailable({ handle }: { handle: string }) {
  const label = handle.trim().slice(0, 64);

  return (
    <div className="flex min-h-screen flex-col bg-white pb-36">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#4b5e70] to-[#a1b8c4] text-2xl font-semibold text-white">
          {(label[0] || "U").toUpperCase()}
        </div>

        <h1 className="font-display text-2xl font-semibold text-brand-text">
          {label ? `@${label}` : "This profile"}
        </h1>

        <p className="max-w-xs text-sm leading-relaxed text-brand-light-text">
          We can&apos;t show this profile on the web right now. Open it in the
          OutfitR app to see their outfits.
        </p>

        <div className="mt-4 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Open in the app
          </a>
          <Link
            href="/explore"
            className="rounded-full border border-brand-border px-5 py-2.5 text-sm font-semibold text-brand-text"
          >
            Discover other outfits
          </Link>
        </div>
      </main>

      <AppStoreBar />
    </div>
  );
}
