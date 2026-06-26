import type { Metadata } from "next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/config";

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
  <script type="text/javascript" src="https://s.skimresources.com/js/305319X1793515.skimlinks.js" async />
</body>
    </html>
  );
}
