import type { Metadata } from "next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/config";
import Script from "next/script";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://app.outfitr.nl";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    images: [{ url: "/brand/logo-mark.png" }],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Script id="sovrn-commerce" strategy="afterInteractive">
          {`
            var vglnk = {key: '48c740e6ae1728a98d53c45ca6f3f0b9'};
            (function(d, t) {
              var s = d.createElement(t);
              s.type = 'text/javascript';
              s.async = true;
              s.src = 'https://cdn.viglink.com/api/vglnk.js';
              var r = d.getElementsByTagName(t)[0];
              r.parentNode.insertBefore(s, r);
            }(document, 'script'));
          `}
        </Script>
        {/* Skimlinks (publisher 313522X1802259, only valid on app.outfitr.nl) */}
        <Script
          id="skimlinks"
          src="https://s.skimresources.com/js/313522X1802259.skimlinks.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
