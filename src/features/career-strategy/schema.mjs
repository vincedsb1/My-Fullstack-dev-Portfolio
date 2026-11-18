/** Runtime contract shared by the static resource producer and the lazy client. */
export const ENGINE_VERSION = "1.1.0";
const fail = () => {
  throw new Error("configuration");
};
const object = (x) => {
  if (!x || typeof x !== "object" || Array.isArray(x)) fail();
  if (
    Object.keys(x).some((k) =>
      ["__proto__", "constructor", "prototype"].includes(k),
    )
  )
    fail();
  return x;
};
const text = (x) => {
  if (typeof x !== "string" || !x.trim()) fail();
};
const list = (x, min = 1) => {
  if (!Array.isArray(x) || x.length < min) fail();
  return x;
};
const unique = (xs) => {
  if (new Set(xs).size !== xs.length) fail();
};
const finite = (x) => {
  if (typeof x !== "number" || !Number.isFinite(x)) fail();
};
function sameKeys(map, expected) {
  const keys = Object.keys(object(map)).sort();
  if (JSON.stringify(keys) !== JSON.stringify([...expected].sort())) fail();
}
function strategyText(x, reasons, cautions) {
  object(x);
  for (const key of ["title", "summary", "horizon", "caveat"]) text(x[key]);
  list(x.steps).forEach(text);
  sameKeys(x.reasons, reasons);
  sameKeys(x.cautions, cautions);
  Object.values(x.reasons).forEach(text);
  Object.values(x.cautions).forEach(text);
}
export function validateBundle(value) {
  const b = object(value);
  if (b.schemaVersion !== 1) fail();
  for (const v of [
    "questionnaireVersion",
    "catalogVersion",
    "engineVersion",
    "contentVersion",
  ])
    text(b[v]);
  const q = object(b.questionnaire),
    c = object(b.catalog),
    t = object(b.content);
  text(q.id);
  text(q.schemaVersion);
  text(c.schemaVersion);
  if (q.version !== b.questionnaireVersion || c.version !== b.catalogVersion)
    fail();
  if (!["fr", "en"].includes(t.locale)) fail();
  for (const k of ["title", "scenario", "notice"]) text(t[k]);
  const dimensions = list(q.dimensions);
  dimensions.forEach((d) => {
    object(d);
    text(d.id);
    text(d.group);
    if (!/^[a-z][a-z0-9_]*$/.test(d.id)) fail();
    text(object(t.groups)[d.group]);
    const dt = object(object(t.dimensions)[d.id]);
    for (const k of ["label", "positive", "negative", "neutral"]) text(dt[k]);
  });
  unique(dimensions.map((d) => d.id));
  sameKeys(
    t.dimensions,
    dimensions.map((d) => d.id),
  );
  sameKeys(t.groups, [...new Set(dimensions.map((d) => d.group))]);
  const dimensionIds = new Set(dimensions.map((d) => d.id));
  const sets = object(q.answerSets);
  for (const options of Object.values(sets)) {
    list(options).forEach((o) => {
      object(o);
      text(o.id);
      text(object(t.answerLabels)[o.id]);
      if (o.value !== null) {
        finite(o.value);
        if (o.value < -2 || o.value > 2) fail();
      }
    });
    unique(options.map((o) => o.id));
  }
  sameKeys(t.answerLabels, [
    ...new Set(
      Object.values(sets)
        .flat()
        .map((o) => o.id),
    ),
  ]);
  list(q.sections).forEach((s) => {
    object(s);
    text(s.id);
    const st = object(object(t.sections)[s.id]);
    text(st.title);
    text(st.description);
    list(s.questions).forEach((x) => {
      object(x);
      if (!/^q\d{3}$/.test(x.id)) fail();
      if (!["court", "approfondi"].includes(x.tier)) fail();
      const qt = object(object(t.questions)[x.id]);
      text(qt.prompt);
      if (x.type === "echelle") {
        if (!Object.hasOwn(sets, x.answerSetId)) fail();
        const scoring = object(x.scoring);
        if (
          !dimensionIds.has(scoring.dimension) ||
          ![1, -1].includes(scoring.direction)
        )
          fail();
        finite(scoring.weight);
        if (scoring.weight <= 0) fail();
      } else if (x.type === "choix_multiple") {
        const opts = list(x.options);
        opts.forEach((o) => text(o.id));
        unique(opts.map((o) => o.id));
        if (
          !Number.isInteger(x.minSelections) ||
          !Number.isInteger(x.maxSelections) ||
          x.minSelections < 1 ||
          x.maxSelections < x.minSelections ||
          x.maxSelections > opts.length
        )
          fail();
        sameKeys(
          qt.options,
          opts.map((o) => o.id),
        );
        Object.values(qt.options).forEach(text);
      } else fail();
    });
  });
  unique(q.sections.map((s) => s.id));
  sameKeys(
    t.sections,
    q.sections.map((s) => s.id),
  );
  const questions = q.sections.flatMap((s) => s.questions);
  unique(questions.map((x) => x.id));
  sameKeys(
    t.questions,
    questions.map((x) => x.id),
  );
  const byQuestion = new Map(questions.map((x) => [x.id, x]));
  list(q.modes).forEach((m) => {
    if (!["court", "complet"].includes(m.id)) fail();
    if (
      m.questionCount !==
      questions.filter((x) => m.id === "complet" || x.tier === "court").length
    )
      fail();
  });
  if (q.modes.length !== 2) fail();
  unique(q.modes.map((m) => m.id));
  const families = object(c.families);
  Object.values(families).forEach(text);
  sameKeys(t.families, Object.keys(families));
  Object.values(t.families).forEach(text);
  object(c.foundation);
  text(c.foundation.id);
  if (!Object.hasOwn(families, c.foundation.family)) fail();
  strategyText(object(t.strategies)[c.foundation.id], [], []);
  list(c.strategies, 4).forEach((s) => {
    object(s);
    text(s.id);
    if (!Object.hasOwn(families, s.family)) fail();
    list(s.signals).forEach((signal) => {
      text(signal.id);
      if (
        !dimensionIds.has(signal.dimension) ||
        ![1, -1].includes(signal.direction)
      )
        fail();
      finite(signal.weight);
      if (signal.weight <= 0) fail();
    });
    unique(s.signals.map((x) => x.id));
    list(s.cautions, 0).forEach((rule) => {
      text(rule.id);
      if (
        !dimensionIds.has(rule.dimension) ||
        !["gte", "lte"].includes(rule.operator)
      )
        fail();
      finite(rule.threshold);
      if (rule.threshold < -2 || rule.threshold > 2) fail();
    });
    unique(s.cautions.map((x) => x.id));
    for (const [qid, options] of Object.entries(object(s.bonuses))) {
      const question = byQuestion.get(qid);
      if (question?.type !== "choix_multiple") fail();
      for (const [option, points] of Object.entries(object(options))) {
        if (!question.options.some((x) => x.id === option)) fail();
        finite(points);
        if (points < 0) fail();
      }
    }
    strategyText(
      object(t.strategies)[s.id],
      s.signals.map((x) => x.id),
      s.cautions.map((x) => x.id),
    );
  });
  unique([c.foundation.id, ...c.strategies.map((s) => s.id)]);
  sameKeys(t.strategies, [c.foundation.id, ...c.strategies.map((s) => s.id)]);
  if (list(c.fallback).length !== 4) fail();
  unique(c.fallback);
  const familyCounts = {},
    pillarCounts = { [families[c.foundation.family]]: 1 };
  for (const id of c.fallback) {
    const strategy = c.strategies.find((x) => x.id === id);
    if (!strategy) fail();
    const family = strategy.family,
      pillar = families[family];
    familyCounts[family] = (familyCounts[family] ?? 0) + 1;
    pillarCounts[pillar] = (pillarCounts[pillar] ?? 0) + 1;
    if (familyCounts[family] > 2 || pillarCounts[pillar] > 2) fail();
  }
}
