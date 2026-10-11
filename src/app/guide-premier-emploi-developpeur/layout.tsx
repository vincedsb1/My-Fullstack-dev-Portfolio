import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "../Providers.tsx";
import "../globals.css";
import "./guide.css";

const inter = Inter({ subsets: ["latin"] });
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
