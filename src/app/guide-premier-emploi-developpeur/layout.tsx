import React from "react";
import { Inter } from "next/font/google";

import Providers from "../Providers.tsx";
import "../globals.css";
import "./guide.css";

const inter = Inter({ subsets: ["latin"] });

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
