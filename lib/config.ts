/**
 * Every "download / open the app" button in this web app links here.
 * The smart redirect in `app/download/route.ts` sends iOS visitors to the
 * App Store and Android visitors to Google Play, both tagged with the
 * "OutfitR webapp" campaign so web-app downloads can be told apart from
 * TikTok and marketing-website downloads.
 */
export const APP_DOWNLOAD_URL = "/download";

/**
 * Apple App Store link with the web-app campaign token (ct=OutfitR webapp).
 * Keep this exact: TikTok uses ct=tiktok and the marketing website
 * (outfitr.nl/download, Netlify) uses ct=website.
 */
export const IOS_APP_STORE_URL =
  "https://apps.apple.com/app/apple-store/id6760657115?pt=128623749&ct=OutfitR%20webapp&mt=8";

/** Android package name, same as in public/.well-known/assetlinks.json. */
export const ANDROID_PACKAGE_NAME = "com.outfitr";

/** Google Play link with an install referrer marking the web app as source. */
export const GOOGLE_PLAY_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}&referrer=${encodeURIComponent(
  "utm_source=OutfitR webapp&utm_medium=webapp"
)}`;

/** @deprecated Link to APP_DOWNLOAD_URL instead, so Android users reach Google Play. */
export const APP_STORE_URL = IOS_APP_STORE_URL;

export const SITE_NAME = "OutfitR";

export const SITE_DESCRIPTION =
  "Ontdek outfits, deel je stijl en vind inspiratie van anderen op OutfitR.";
