import Image from "next/image";
import Link from "next/link";
import { APP_STORE_URL } from "@/lib/config";

export default function PostNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
      <Image
        src="/brand/logo-mark-light.png"
        alt="OutfitR"
        width={140}
        height={90}
        className="opacity-80"
      />
      <h1 className="font-display text-2xl font-semibold">
        Deze post kon niet worden gevonden
      </h1>
      <p className="max-w-xs text-sm text-white/70">
        De post is mogelijk verwijderd of de link is niet meer geldig.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/explore"
          className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Ontdek andere posts
        </Link>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-brand-secondary px-5 py-2.5 text-sm font-semibold text-brand-primary-dark"
        >
          Open de app
        </a>
      </div>
    </div>
  );
}
