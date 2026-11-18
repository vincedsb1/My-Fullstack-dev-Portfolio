import { describe, expect, it } from "vitest";
import fr from "@/i18n/messages/fr.json";
import en from "@/i18n/messages/en.json";
import {
  ANNOUNCED_QUESTIONS,
  PILLARS,
  QUESTIONS,
  SCALE,
  STEPS,
  TWIST_STEP,
  UNSURE,
} from "@/features/career-strategy/journey";

type Tree = { [key: string]: string | Tree };
const keys = (tree: Tree, prefix = ""): string[] =>
  Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [prefix + key]
      : keys(value, `${prefix}${key}.`),
  );
const messages = {
  fr: fr.careerStrategy as unknown as Tree,
  en: en.careerStrategy as unknown as Tree,
};

describe("career strategy narrative journey", () => {
  it("runs welcome, two questions, the twist, five pillars and a conclusion", () => {
    expect(STEPS.map((step) => step.kind)).toEqual([
      "welcome",
      "question",
      "question",
      "twist",
      "pillar",
      "pillar",
      "pillar",
      "pillar",
      "pillar",
      "conclusion",
    ]);
    expect(TWIST_STEP).toBe(1 + QUESTIONS.length);
    expect(ANNOUNCED_QUESTIONS - QUESTIONS.length).toBe(28);
    expect(PILLARS.map((pillar) => pillar.id)).toEqual([
      "skills",
      "wealth",
      "business",
      "products",
      "audience",
    ]);
  });

  it("keeps the first two questions of the original questionnaire", () => {
    expect(QUESTIONS.map((question) => question.id)).toEqual(["q001", "q002"]);
    expect(SCALE).toHaveLength(5);
    expect(UNSURE.id).toBe("ne_sais_pas");
  });

  it("has the same message keys in French and English, with no legacy engine copy", () => {
    expect(keys(messages.fr)).toEqual(keys(messages.en));
    for (const legacy of [
      "strategiesTitle",
      "calculationError",
      "uncertainty",
      "portrait",
      "resume",
    ])
      expect(keys(messages.fr).some((key) => key.startsWith(legacy))).toBe(
        false,
      );
  });

  for (const locale of ["fr", "en"] as const) {
    it(`${locale}: provides every question, answer and pillar text`, () => {
      const m = messages[locale] as Record<string, Record<string, Tree>>;
      for (const { id } of QUESTIONS) {
        const text = m.questions[id] as Record<string, string>;
        expect(text.prompt).toContain(text.highlight);
        expect(text.context.length).toBeGreaterThan(0);
      }
      for (const { id } of [...SCALE, UNSURE])
        expect(m.answerLabels[id]).toBeTypeOf("string");
      for (const { id } of PILLARS) {
        const pillar = m.pillars[id] as Record<string, string>;
        for (const field of ["short", "title", "text", "action1", "action2"])
          expect(pillar[field]?.length).toBeGreaterThan(0);
        expect(pillar.title).toContain(pillar.highlight);
        const sentences = pillar.text.split(/[.…](?:\s|$)/).filter(Boolean);
        expect(sentences.length).toBeGreaterThanOrEqual(2);
        expect(sentences.length).toBeLessThanOrEqual(4);
      }
      const story = m.story as Record<string, Record<string, string>>;
      expect(story.twist.p1).toContain("{remaining}");
      expect(story.twist.title).toContain(story.twist.highlight);
      expect(story.conclusion.title).toContain(story.conclusion.highlight);
      expect(story.conclusion.title).toContain("{total}");
    });
  }
});
