import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import manifest from "@/content/career-strategy/bundle-manifest.json";
import { validateBundle } from "@/features/career-strategy/schema.mjs";
import {
  calculateDimensions,
  getQuestions,
  recommendStrategies,
  submit,
  validateAnswers,
} from "@/features/career-strategy/engine";
import {
  buildPortrait,
  dimensionBand,
} from "@/features/career-strategy/build-portrait";
import {
  envelope,
  parseSaved,
  readSaved,
  saveDraft,
  MAX_AGE,
  STORAGE_KEY,
} from "@/features/career-strategy/storage";
import type { Answers, Bundle, Mode } from "@/features/career-strategy/types";
const read = (locale: "fr" | "en"): Bundle => {
  const value: unknown = JSON.parse(
    readFileSync("public" + manifest.urls[locale], "utf8"),
  );
  validateBundle(value);
  return value;
};
const fr = read("fr"),
  en = read("en"),
  q = fr.questionnaire,
  catalog = fr.catalog;
function answers(
  mode: Mode,
  preferences: Record<string, number> = {},
  unknown = false,
): Answers {
  return Object.fromEntries(
    getQuestions(q, mode).map((x) => {
      if (x.type === "choix_multiple") return [x.id, [x.options![0].id]];
      const score =
        (preferences[x.scoring!.dimension] ?? 0) * x.scoring!.direction;
      return [
        x.id,
        unknown
          ? "ne_sais_pas"
          : score >= 1.5
          ? "tout_a_fait"
          : score >= 0.5
          ? "plutot_oui"
          : score <= -1.5
          ? "pas_du_tout"
          : score <= -0.5
          ? "plutot_non"
          : "neutre",
      ];
    }),
  );
}
describe("career strategy contracts", () => {
  it("validates FR/EN with identical canonical rules and no French question copy in EN", () => {
    expect(fr.questionnaire).toEqual(en.questionnaire);
    expect(fr.catalog).toEqual(en.catalog);
    expect(Object.keys(fr.content.questions)).toHaveLength(80);
    for (const id of Object.keys(fr.content.questions))
      expect(fr.content.questions[id].prompt).not.toBe(
        en.content.questions[id].prompt,
      );
  });
  it("rejects broken references, duplicate IDs, invalid weights and missing translations", () => {
    const cases = [
      (b: Bundle) => {
        b.questionnaire.sections[0].questions[0].scoring!.dimension =
          "invented";
      },
      (b: Bundle) => {
        b.questionnaire.sections[0].questions[0].scoring!.weight = -1;
      },
      (b: Bundle) => {
        b.questionnaire.sections[0].questions[1].id = "q001";
      },
      (b: Bundle) => {
        delete b.content.questions.q001;
      },
      (b: Bundle) => {
        b.catalog.fallback = [
          "apprendre_ia",
          "expertise_metier",
          "maintien_employabilite",
          "reseau_confiance",
        ];
      },
      (b: Bundle) => {
        b.catalog.strategies[0].bonuses.q015 = { unknown: 3 };
      },
    ];
    for (const change of cases) {
      const b = structuredClone(fr);
      change(b);
      expect(() => validateBundle(b)).toThrow();
    }
    for (const input of [null, [], {}, { ...fr, schemaVersion: 7 }])
      expect(() => validateBundle(input)).toThrow();
  });
});
describe("dimensions and recommendation engine", () => {
  for (const mode of ["court", "complet"] as const) {
    it(`${mode}: respects the source counts, nulls and missing dimensions`, () => {
      expect(getQuestions(q, mode)).toHaveLength(mode === "court" ? 40 : 80);
      const d = calculateDimensions(q, mode, answers(mode));
      expect(Object.keys(d)).toHaveLength(mode === "court" ? 37 : 48);
      expect(Object.values(d).filter((x) => x.count === 1)).toHaveLength(
        mode === "court" ? 36 : 21,
      );
      expect(calculateDimensions(q, mode, answers(mode, {}, true))).toEqual({});
      if (mode === "court") expect(d.teletravail).toBeUndefined();
    });
    it(`${mode}: generic fallback has an explicit final order and ignores qualitative bonuses`, () => {
      const a = answers(mode, {}, true);
      expect(
        recommendStrategies(q, catalog, mode, a).recommendations.map(
          (s) => s.id,
        ),
      ).toEqual([
        "socle_financier",
        "maintien_employabilite",
        "apprendre_ia",
        "reseau_confiance",
        "reconversion_progressive",
      ]);
      a.q015 = ["raconter", "construire"];
      const r = submit(q, catalog, mode, a);
      expect(r.generic).toBe(true);
      expect(r.recommendations.slice(1).map((s) => s.kind)).toEqual([
        "general",
        "general",
        "general",
        "general",
      ]);
      expect(
        r.recommendations.every(
          (s) => s.score === null && s.reasons.length === 0,
        ),
      ).toBe(true);
    });
    it(`${mode}: low-level 75% and public 100% thresholds are different`, () => {
      const pairs = Object.entries(answers(mode));
      const count = pairs.length;
      for (const n of [
        Math.ceil(count * 0.75) - 1,
        Math.ceil(count * 0.75),
        count - 1,
        count,
      ]) {
        const a = Object.fromEntries(pairs.slice(0, n));
        if (n < Math.ceil(count * 0.75))
          expect(() => recommendStrategies(q, catalog, mode, a)).toThrow(
            "incomplete",
          );
        else
          expect(() => recommendStrategies(q, catalog, mode, a)).not.toThrow();
        if (n < count)
          expect(() => submit(q, catalog, mode, a)).toThrow("incomplete");
        else expect(() => submit(q, catalog, mode, a)).not.toThrow();
      }
    });
  }
  it("reverses values and identifies divergent rather than missing answers", () => {
    expect(
      calculateDimensions(q, "complet", { q070: "tout_a_fait" })
        .risque_financier.value,
    ).toBe(-2);
    expect(
      calculateDimensions(q, "complet", { q070: "pas_du_tout" })
        .risque_financier.value,
    ).toBe(2);
    expect(
      calculateDimensions(q, "court", { q001: "ne_sais_pas" }).analyse,
    ).toBeUndefined();
    expect(
      calculateDimensions(q, "court", { q001: "neutre" }).analyse.value,
    ).toBe(0);
    expect(
      calculateDimensions(q, "court", {
        q041: "tout_a_fait",
        q042: "tout_a_fait",
      }).introversion,
    ).toMatchObject({ count: 2, value: 0, contradictory: true });
  });
  it("rejects invalid payloads and cardinalities instead of coercing them", () => {
    for (const a of [
      null,
      [],
      { q076: "tout_a_fait" },
      { q001: "invalid" },
      { q001: [] },
      { q015: [] },
      { q015: ["imaginer", "imaginer"] },
      { q015: ["imaginer", "concevoir", "construire"] },
      { q015: "imaginer" },
    ])
      expect(() => validateAnswers(q, "court", a)).toThrow();
    expect(() => getQuestions(q, "unknown" as Mode)).toThrow("mode");
  });
  it("keeps deterministic, diverse and language-independent results for contrasted profiles", () => {
    const profiles: Record<string, number>[] = [
      {
        entrepreneuriat: 2,
        construction: 2,
        autonomie: 2,
        liberte_temps: 2,
        risque_financier: -2,
        vente: -2,
        prospection: -2,
        stabilite: 2,
      },
      {
        travail_physique: 2,
        mobilite: 2,
        aide_autrui: 2,
        experimentation: 2,
        construction: 2,
        entrepreneuriat: -2,
        expression_publique: -2,
      },
    ];
    const ids: string[][] = [];
    for (const p of profiles) {
      const a = answers("complet", p),
        before = JSON.stringify([q, catalog, a]);
      const r = submit(q, catalog, "complet", a);
      expect(r.generic).toBe(false);
      expect(r).toEqual(
        submit(
          en.questionnaire,
          en.catalog,
          "complet",
          Object.fromEntries(Object.entries(a).reverse()),
        ),
      );
      expect(new Set(r.recommendations.map((x) => x.id)).size).toBe(5);
      const families = r.recommendations.slice(1).map((x) => x.family),
        pillars = r.recommendations.map((x) => catalog.families[x.family]);
      expect(
        families.every((x) => families.filter((y) => x === y).length <= 2),
      ).toBe(true);
      expect(
        pillars.every((x) => pillars.filter((y) => x === y).length <= 2),
      ).toBe(true);
      expect(JSON.stringify([q, catalog, a])).toBe(before);
      ids.push(r.recommendations.map((x) => x.id));
    }
    expect(ids[0]).not.toEqual(ids[1]);
  });
  it("fails an insufficient personalised catalogue instead of relaxing the pillar limit", () => {
    const c = structuredClone(catalog);
    c.strategies = c.strategies.filter(
      (s) => catalog.families[s.family] === "employabilite",
    );
    expect(() =>
      submit(
        q,
        c,
        "complet",
        answers("complet", {
          analyse: 2,
          systemique: 2,
          esprit_critique: 2,
          pragmatisme: 2,
          ideation: 2,
          construction: 2,
          autonomie: 2,
        }),
      ),
    ).toThrow("configuration");
  });
});
describe("qualitative portrait", () => {
  it("has explicit non-overlapping boundaries", () => {
    expect([-2, -1.2, -0.4, 0, 0.4, 1.2, 2].map(dimensionBand)).toEqual([
      "very-low",
      "very-low",
      "low",
      "neutral",
      "high",
      "very-high",
      "very-high",
    ]);
  });
  it("flags single items and never fabricates short-mode environment preferences", () => {
    const p = buildPortrait(
      fr,
      calculateDimensions(q, "court", {
        q001: "tout_a_fait",
        q041: "tout_a_fait",
        q042: "pas_du_tout",
      }),
    );
    expect(p.find((x) => x.id === "cognition")!.highlights[0]).toMatchObject({
      id: "analyse",
      tentative: true,
      text: "Explorer les causes avant d’agir",
    });
    expect(p.find((x) => x.id === "relations")!.highlights[0]).toMatchObject({
      id: "introversion",
      tentative: false,
    });
    expect(p.find((x) => x.id === "environnement")!.details).toEqual([]);
    expect(
      buildPortrait(
        en,
        calculateDimensions(q, "court", { q001: "tout_a_fait" }),
      )[0].highlights[0].text,
    ).toBe("Exploring causes before acting");
  });
});
describe("optional local drafts", () => {
  const now = 1800000000000;
  const draft = {
    mode: "court" as const,
    answers: { q001: "plutot_oui" },
    phase: "questions" as const,
    section: 0,
    returnToReview: false,
  };
  it("restores valid partial drafts across languages without persisting results", () => {
    const saved = envelope(fr, draft, "revision-1", now);
    expect(parseSaved(JSON.stringify(saved), en, now)).toEqual({
      kind: "valid",
      saved,
    });
    expect(
      Object.keys(saved).some((k) =>
        ["portrait", "recommendations", "dimensions", "scores"].includes(k),
      ),
    ).toBe(false);
    const changed = {
      ...en,
      catalogVersion: "new",
      engineVersion: "new",
      contentVersion: "new",
    };
    expect(parseSaved(JSON.stringify(saved), changed, now).kind).toBe("valid");
    expect(
      parseSaved(
        JSON.stringify(saved),
        { ...en, questionnaireVersion: "incompatible" },
        now,
      ).kind,
    ).toBe("invalid");
  });
  it("rejects corruption, invalid values, impossible phases and expiry", () => {
    const saved = envelope(fr, draft, "revision-1", now);
    expect(parseSaved(JSON.stringify(saved), fr, now + MAX_AGE)).toEqual({
      kind: "expired",
    });
    for (const raw of [
      "{",
      "null",
      "[]",
      JSON.stringify({ ...saved, draft: { ...draft, phase: "results" } }),
      JSON.stringify({
        ...saved,
        draft: { ...draft, answers: { q001: "invalid" } },
      }),
      JSON.stringify({ ...saved, savedAt: now + 100000 }),
    ])
      expect(parseSaved(raw, fr, now).kind).toBe("invalid");
    expect(parseSaved(null, fr).kind).toBe("none");
  });
  it("does not disguise denied storage or quota failures as successful saves", () => {
    const memory = new Map<string, string>();
    const port = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => {
        memory.set(k, v);
      },
      removeItem: (k: string) => {
        memory.delete(k);
      },
    };
    saveDraft(port, fr, draft, "revision", now);
    expect(memory.has(STORAGE_KEY)).toBe(true);
    expect(readSaved(port, en, now).kind).toBe("valid");
    const denied = {
      ...port,
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(readSaved(denied, fr).kind).toBe("unavailable");
    expect(() => saveDraft(denied, fr, draft, "revision", now)).toThrow(
      "quota",
    );
  });
});
