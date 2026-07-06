import type { Metadata } from "next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/config";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
            var vglnk = {key: '5eabd0ec7c28fda6ae37e65f16350924'};
            (function(d, t) {
              var s = d.createElement(t);
              s.type = 'text/javascript';
              s.async = true;
              s.src = '//cdn.viglink.com/api/vglnk.js';
              var r = d.getElementsByTagName(t)[0];
              r.parentNode.insertBefore(s, r);
            }(document, 'script'));
          `}
        </Script>
      </body>
    </html>
  );
}
