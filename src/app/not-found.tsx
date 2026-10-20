import React from "react";
import Link from "next/link";

import "./globals.css";

export const metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

// This global boundary provides its own document shell because the app uses
// route-group root layouts for the localized and standalone sections.
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main className="w-full min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col justify-center items-center px-4">
          <h1 className="text-neutral-700 dark:text-neutral-300 font-bold text-4xl mb-2">
            404
          </h1>
          <p className="text-neutral-400 dark:text-neutral-500 mb-8">
            Page not found
          </p>
          <Link
            href="/en"
            className="flex justify-center h-12 items-center bg-neutral-600 dark:bg-neutral-300 rounded-xl px-5 py-3 text-neutral-100 dark:text-neutral-900 hover:bg-neutral-500 dark:hover:bg-neutral-400 transition-all"
          >
            Home
          </Link>
        </main>
      </body>
    </html>
  );
}
