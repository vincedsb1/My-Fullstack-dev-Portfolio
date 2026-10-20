import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Script from "next/script";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// The root layout owns the document tags. Keeping this segment layout allows
// the standalone route to remain isolated from the localized application tree.
export default function JulieDierisLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              '(()=>{let storedTheme;try{storedTheme=localStorage.getItem("theme");}catch{}const theme=storedTheme==="light"||storedTheme==="dark"?storedTheme:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";const root=document.documentElement;root.classList.remove("light","dark");root.classList.add(theme);root.style.colorScheme=theme;})();',
          }}
        />
        <meta
          name="google-site-verification"
          content="PW82MjVgB5OXOfa6RcjIX06LfN3lZ1arROcD41Ao1z4"
        />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-aos]{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
