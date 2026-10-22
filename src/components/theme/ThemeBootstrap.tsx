"use client";
import { useLayoutEffect } from "react";
import { initializeTheme, resolveTheme } from "@/lib/theme/initializer";
// A root not-found document may be inserted during client recovery rather than
// parsed as a full document; inline scripts in that case remain inert.
export default function ThemeBootstrap() {
  useLayoutEffect(() => initializeTheme(resolveTheme), []);
  return null;
}
