import { inter } from "@/lib/fonts";
import { themeInitializer } from "@/lib/theme/initializer";
import type { ReactNode } from "react";
import Script from "next/script";
import "../globals.css";

// The root layout owns the document tags. Keeping this segment layout allows
// the standalone route to remain isolated from the localized application tree.
export default function JulieDierisLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className={inter.variable} lang="fr" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: themeInitializer,
          }}
        />
        <meta
          name="google-site-verification"
          content="PW82MjVgB5OXOfa6RcjIX06LfN3lZ1arROcD41Ao1z4"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
