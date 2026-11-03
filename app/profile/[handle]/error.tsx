"use client";

import Link from "next/link";
import { APP_DOWNLOAD_URL } from "@/lib/config";

export default function ProfileError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-bg px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-brand-text">
        Temporarily unavailable
      </h1>
      <p className="max-w-xs text-sm text-brand-light-text">
        We couldn&apos;t load this profile. Please try again, or open it in the
        OutfitR app.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/explore"
          className="rounded-full border border-brand-border px-5 py-2.5 text-sm font-semibold text-brand-text"
        >
          Go to Explore
        </Link>
        <a
          href={APP_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand-border px-5 py-2.5 text-sm font-semibold text-brand-text"
        >
          Open the app
        </a>
      </div>
    </div>
  );
}
