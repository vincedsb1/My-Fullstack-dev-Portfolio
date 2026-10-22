import ThemeBootstrap from "@/components/theme/ThemeBootstrap";
import { inter } from "@/lib/fonts";
import { themeInitializer } from "@/lib/theme/initializer";
import "./globals.css";
export const metadata = {
  title: "404",
  robots: { index: false, follow: false },
};
export default function NotFound() {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body className="font-sans">
        <ThemeBootstrap />
        <main className="mx-auto min-h-screen max-w-3xl px-4 py-24">
          <h1 className="text-h1 font-bold">404</h1>
          <p className="mt-5 text-lead text-content-muted">
            Page introuvable · Page not found
          </p>
          <nav className="mt-8 flex gap-6">
            <a href={`/${"fr"}`} lang="fr" className="text-accent underline">
              Accueil en français
            </a>
            <a href={`/${"en"}`} lang="en" className="text-accent underline">
              Home in English
            </a>
          </nav>
        </main>
      </body>
    </html>
  );
}
