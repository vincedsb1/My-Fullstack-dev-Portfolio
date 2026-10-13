import type { ReactNode } from "react";

// The root layout owns the document tags. Keeping this segment layout allows
// the standalone route to remain isolated from the localized application tree.
export default function JulieDierisLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
