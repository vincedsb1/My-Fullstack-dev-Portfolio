import { routing, type Locale } from "./routing";
type StaticPath = Exclude<
  keyof typeof routing.pathnames,
  | "/projects/[slug]"
  | "/projects/[slug]/social-image"
  | "/projects/preview/[variant]"
  | "/blog/[slug]"
>;
type Href =
  | StaticPath
  | {
      pathname:
        | "/projects/[slug]"
        | "/projects/[slug]/social-image"
        | "/blog/[slug]";
      params: { slug: string };
    }
  | { pathname: "/projects/preview/[variant]"; params: { variant: string } };
// Shared routing table, with no client navigation module in the server graph.
export function getPathname({ locale, href }: { locale: Locale; href: Href }) {
  const pathname = typeof href === "string" ? href : href.pathname;
  const mapping = routing.pathnames[pathname];
  let path: string = typeof mapping === "string" ? mapping : mapping[locale];
  if (typeof href !== "string")
    for (const [key, value] of Object.entries(href.params))
      path = path.replace(`[${key}]`, encodeURIComponent(value));
  return `/${locale}${path === "/" ? "" : path}`;
}
