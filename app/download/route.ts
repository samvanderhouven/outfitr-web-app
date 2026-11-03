import { NextResponse, type NextRequest } from "next/server";
import { GOOGLE_PLAY_URL, IOS_APP_STORE_URL } from "@/lib/config";

// Depends on the visitor's User-Agent, so it must never be cached or prerendered.
export const dynamic = "force-dynamic";

/**
 * Smart app download link for the web app.
 * - Android → Google Play (referrer: OutfitR webapp)
 * - iPhone / iPad / iPod and everything else (desktop) → App Store
 *   with campaign token "OutfitR webapp" (same destination as before for desktop).
 */
export function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? "";
  const isAndroid = /android/i.test(userAgent);
  const target = isAndroid ? GOOGLE_PLAY_URL : IOS_APP_STORE_URL;

  const response = NextResponse.redirect(target, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Vary", "User-Agent");
  return response;
}
