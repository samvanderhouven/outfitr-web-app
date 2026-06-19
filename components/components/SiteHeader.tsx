import Image from "next/image";
import Link from "next/link";
import { APP_STORE_URL } from "@/lib/config";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/explore" className="flex items-center gap-2">
          <Image
            src="/brand/logo-mark.png"
            alt="OutfitR"
            width={34}
            height={34}
            className="rounded-lg"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-brand-text">
            OutfitR
          </span>
        </Link>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark sm:inline-block"
        >
          Download de app
        </a>
      </div>
    </header>
  );
}
