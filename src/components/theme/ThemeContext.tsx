"use client";

import { resolveTheme } from "@/lib/theme/initializer";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: typeof setTheme;
}

const STORAGE_KEY = "theme";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

const defaultThemeContext: ThemeContextValue = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
};

const ThemeContext = createContext(defaultThemeContext);
const serverSnapshot = defaultThemeContext;
let clientSnapshot = serverSnapshot;
const listeners = new Set<() => void>();
let initialized = false;

function normalizeTheme(value: string | null): Theme {
  return value === "light" || value === "dark" ? value : "system";
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolvedTheme = resolveTheme(
    theme,
    window.matchMedia(SYSTEM_THEME_QUERY).matches,
  );
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;

  return resolvedTheme;
}

function publishTheme(theme: Theme, resolvedTheme: ResolvedTheme) {
  clientSnapshot = { theme, resolvedTheme, setTheme };
  listeners.forEach((listener) => listener());
}

function setTheme(nextTheme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  } catch {
    // Theme changes still apply when browser storage is unavailable.
  }

  publishTheme(nextTheme, applyTheme(nextTheme));
}

function initializeThemeStore() {
  if (typeof window === "undefined") return;
  if (initialized) {
    applyTheme(clientSnapshot.theme);
    return;
  }
  initialized = true;

  let initialTheme: Theme;
  try {
    initialTheme = normalizeTheme(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    initialTheme = "system";
  }
  clientSnapshot = {
    theme: initialTheme,
    resolvedTheme: applyTheme(initialTheme),
    setTheme,
  };

  const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
  mediaQuery.addEventListener("change", () => {
    if (clientSnapshot.theme === "system") {
      publishTheme("system", applyTheme("system"));
    }
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;

    const nextTheme = normalizeTheme(event.newValue);
    publishTheme(nextTheme, applyTheme(nextTheme));
  });
}

function subscribe(listener: () => void) {
  initializeThemeStore();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getClientSnapshot() {
  return clientSnapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeValue = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
