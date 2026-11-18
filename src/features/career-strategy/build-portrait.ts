import type { Bundle, Dimension } from "./types";
import { lexical } from "./engine";
export function dimensionBand(value: number) {
  if (value <= -1.2) return "very-low";
  if (value <= -0.4) return "low";
  if (value < 0.4) return "neutral";
  if (value < 1.2) return "high";
  return "very-high";
}
export function buildPortrait(
  bundle: Bundle,
  dimensions: Record<string, Dimension>,
) {
  return Object.entries(bundle.content.groups).map(([id, title]) => {
    const details = bundle.questionnaire.dimensions
      .filter((d) => d.group === id && dimensions[d.id])
      .map((d) => {
        const observation = dimensions[d.id],
          text = bundle.content.dimensions[d.id];
        const band = dimensionBand(observation.value);
        return {
          id: d.id,
          label: text.label,
          observation,
          band,
          tentative: observation.count < 2 || observation.contradictory,
          text:
            band === "neutral"
              ? text.neutral
              : observation.value > 0
              ? text.positive
              : text.negative,
        };
      });
    const highlights = details
      .filter((d) => d.band !== "neutral")
      .sort(
        (a, b) =>
          Number(a.tentative) - Number(b.tentative) ||
          Math.abs(b.observation.value) - Math.abs(a.observation.value) ||
          lexical(a.id, b.id),
      )
      .slice(0, 2);
    return { id, title, highlights, details };
  });
}
