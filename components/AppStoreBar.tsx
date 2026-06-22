import Image from "next/image";
import { APP_STORE_URL } from "@/lib/config";

export default function AppStoreBar({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={
        isDark
          ? "fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#10161d]/95 backdrop-blur-md"
          : "fixed inset-x-0 bottom-0 z-50 border-t border-brand-border bg-white/95 backdrop-blur-md"
      }
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={
              isDark
                ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10"
                : "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10"
            }
          >
            <Image
              src="/brand/logo-mark.png"
              alt="OutfitR"
              width={28}
              height={28}
              className="rounded-md"
            />
          </div>
          <p
            className={
              isDark
                ? "truncate text-sm font-medium text-white/90"
                : "truncate text-sm font-medium text-brand-text"
            }
          >
            Get the full experience in the app
          </p>
        </div>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95 hover:bg-brand-primary-dark"
        >
          Open app
        </a>
      </div>
    </div>
  );
}
