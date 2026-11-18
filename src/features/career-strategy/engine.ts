import type {
  Answers,
  Catalog,
  Dimension,
  Mode,
  Questionnaire,
  Recommendation,
  Result,
  Strategy,
} from "./types";
export class InputError extends Error {
  code: "mode" | "answer" | "incomplete" | "configuration";
  questionId?: string;
  constructor(code: InputError["code"], questionId?: string) {
    super(code);
    this.code = code;
    this.questionId = questionId;
  }
}
export const lexical = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const clamp = (x: number, min: number, max: number) =>
  Math.min(max, Math.max(min, x));
export function getQuestions(q: Questionnaire, mode: Mode) {
  if (mode !== "court" && mode !== "complet") throw new InputError("mode");
  return q.sections
    .flatMap((s) => s.questions)
    .filter((x) => mode === "complet" || x.tier === "court");
}
/** Partial drafts use ratio=0; public submission always uses ratio=1. */
export function validateAnswers(
  q: Questionnaire,
  mode: Mode,
  value: unknown,
  ratio = 0,
): Answers {
  const questions = getQuestions(q, mode);
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new InputError("answer");
  const byId = new Map(questions.map((x) => [x.id, x]));
  const answers: Answers = {};
  for (const [id, answer] of Object.entries(value)) {
    const x = byId.get(id);
    if (!x) throw new InputError("answer", id);
    if (x.type === "echelle") {
      if (
        typeof answer !== "string" ||
        !q.answerSets[x.answerSetId!].some((o) => o.id === answer)
      )
        throw new InputError("answer", id);
      answers[id] = answer;
    } else {
      if (
        !Array.isArray(answer) ||
        answer.some(
          (v) => typeof v !== "string" || !x.options!.some((o) => o.id === v),
        ) ||
        new Set(answer).size !== answer.length ||
        answer.length < x.minSelections! ||
        answer.length > x.maxSelections!
      )
        throw new InputError("answer", id);
      answers[id] = [...answer];
    }
  }
  if (Object.keys(answers).length < Math.ceil(questions.length * ratio))
    throw new InputError("incomplete");
  return answers;
}
export function calculateDimensions(
  q: Questionnaire,
  mode: Mode,
  answers: Answers,
): Record<string, Dimension> {
  const checked = validateAnswers(q, mode, answers);
  const sums = new Map<
    string,
    { sum: number; weight: number; values: number[]; ids: string[] }
  >();
  for (const x of getQuestions(q, mode)) {
    if (!x.scoring || typeof checked[x.id] !== "string") continue;
    const option = q.answerSets[x.answerSetId!].find(
      (o) => o.id === checked[x.id],
    );
    if (!option || option.value === null) continue;
    const { dimension, direction, weight } = x.scoring;
    const s = sums.get(dimension) ?? { sum: 0, weight: 0, values: [], ids: [] };
    const v = option.value * direction;
    s.sum += v * weight;
    s.weight += weight;
    s.values.push(v);
    s.ids.push(x.id);
    sums.set(dimension, s);
  }
  return Object.fromEntries(
    Array.from(sums.entries()).map(([id, s]) => [
      id,
      {
        value: clamp(s.sum / s.weight, -2, 2),
        count: s.ids.length,
        contradictory:
          s.values.some((v) => v <= -1) && s.values.some((v) => v >= 1),
        questionIds: s.ids,
      },
    ]),
  );
}
function evaluate(
  strategy: Strategy,
  dimensions: Record<string, Dimension>,
  answers: Answers,
): Recommendation {
  const total = strategy.signals.reduce((n, s) => n + s.weight, 0);
  let evidence = 0,
    count = 0;
  const matches: { id: string; value: number }[] = [],
    conflicts: { id: string; value: number }[] = [];
  for (const s of strategy.signals) {
    const d = dimensions[s.dimension];
    if (!d) continue;
    count++;
    const signed = (d.value / 2) * s.direction;
    const contribution =
      s.weight * signed * (d.contradictory ? 0.5 : d.count === 1 ? 0.85 : 1);
    evidence += contribution;
    if (signed >= 0.35) matches.push({ id: s.id, value: contribution });
    if (signed <= -0.5) conflicts.push({ id: s.id, value: contribution });
  }
  let bonus = 0;
  for (const [id, options] of Object.entries(strategy.bonuses)) {
    const answer = answers[id];
    if (Array.isArray(answer))
      for (const option of answer) bonus += options[option] ?? 0;
  }
  matches.sort((a, b) => b.value - a.value || lexical(a.id, b.id));
  conflicts.sort((a, b) => a.value - b.value || lexical(a.id, b.id));
  return {
    id: strategy.id,
    family: strategy.family,
    score: clamp(
      50 + (total ? (34 * evidence) / total : 0) + clamp(bonus, 0, 10),
      0,
      100,
    ),
    reasons: matches.slice(0, 2).map((m) => m.id),
    conflicts: conflicts.slice(0, 1).map((m) => m.id),
    cautions: strategy.cautions
      .filter(
        (r) =>
          dimensions[r.dimension] &&
          (r.operator === "gte"
            ? dimensions[r.dimension].value >= r.threshold
            : dimensions[r.dimension].value <= r.threshold),
      )
      .map((r) => r.id),
    kind: count < 2 || matches.length === 0 ? "exploratory" : "matched",
  };
}
/** Retains the prototype's 75% low-level contract. UI submission uses submit(). */
export function recommendStrategies(
  q: Questionnaire,
  catalog: Catalog,
  mode: Mode,
  input: unknown,
): Result {
  const answers = validateAnswers(q, mode, input, 0.75);
  const dimensions = calculateDimensions(q, mode, answers);
  const generic =
    Object.values(dimensions).filter((d) => Math.abs(d.value) >= 0.4).length <
    6;
  const foundation: Recommendation = {
    ...catalog.foundation,
    score: null,
    reasons: [],
    conflicts: [],
    cautions: [],
    kind: "foundation",
  };
  const evaluated = catalog.strategies.map((s) =>
    evaluate(s, dimensions, answers),
  );
  if (generic) {
    const recommendations = catalog.fallback.map((id): Recommendation => {
      const s = evaluated.find((x) => x.id === id);
      if (!s) throw new InputError("configuration");
      return {
        ...s,
        score: null,
        reasons: [],
        conflicts: [],
        cautions: [],
        kind: "general",
      };
    });
    if (
      recommendations.length !== 4 ||
      new Set(recommendations.map((s) => s.id)).size !== 4
    )
      throw new InputError("configuration");
    return {
      dimensions,
      generic,
      recommendations: [foundation, ...recommendations],
    };
  }
  const families = new Map<string, number>(),
    pillars = new Map<string, number>([
      [catalog.families[foundation.family], 1],
    ]);
  const remaining = [...evaluated],
    selected: Recommendation[] = [];
  const objective = (s: Recommendation) =>
    s.score! -
    (families.get(s.family) ?? 0) * 12 -
    (pillars.get(catalog.families[s.family]) ?? 0) * 9;
  while (selected.length < 4) {
    const pool = remaining.filter(
      (s) =>
        (families.get(s.family) ?? 0) < 2 &&
        (pillars.get(catalog.families[s.family]) ?? 0) < 2,
    );
    pool.sort((a, b) => objective(b) - objective(a) || lexical(a.id, b.id));
    const s = pool[0];
    if (!s) throw new InputError("configuration");
    selected.push(s);
    families.set(s.family, (families.get(s.family) ?? 0) + 1);
    const pillar = catalog.families[s.family];
    pillars.set(pillar, (pillars.get(pillar) ?? 0) + 1);
    remaining.splice(
      remaining.findIndex((x) => x.id === s.id),
      1,
    );
  }
  return { dimensions, generic, recommendations: [foundation, ...selected] };
}
export function submit(
  q: Questionnaire,
  catalog: Catalog,
  mode: Mode,
  input: unknown,
) {
  const answers = validateAnswers(q, mode, input, 1);
  return recommendStrategies(q, catalog, mode, answers);
}
