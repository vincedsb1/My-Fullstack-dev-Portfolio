export function resolveTheme(
  value: string | null,
  dark: boolean,
): "light" | "dark" {
  return value === "light" || value === "dark"
    ? value
    : dark
    ? "dark"
    : "light";
}
export function initializeTheme(resolve: typeof resolveTheme) {
  let value: string | null = null;
  try {
    value = localStorage.getItem("theme");
  } catch {
    // Keep the system preference when storage is unavailable.
  }
  const theme = resolve(
    value,
    matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}
export const themeInitializer = `(${initializeTheme.toString()})(${resolveTheme.toString()});`;
