"use client";

import { SurfaceButton } from "@/components/ui/Button";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Check, Sparkles } from "lucide-react";

const languageOptions = [
  { code: "fr", label: "Français", phrase: "Votre icône est prête" },
  { code: "en", label: "English", phrase: "Your icon is ready" },
  { code: "de", label: "Deutsch", phrase: "Dein Icon ist bereit" },
  { code: "es", label: "Español", phrase: "Tu icono está listo" },
  { code: "pt", label: "Português (BR)", phrase: "Seu ícone está pronto" },
  { code: "ja", label: "日本語", phrase: "アイコンの準備ができました" },
] as const;

type LanguageCode = (typeof languageOptions)[number]["code"];
type ModuleVariant = "mosaic" | "demo" | "matrix" | "funnel" | "decision";

const interfaceCopy: Record<
  LanguageCode,
  {
    interfaceLabel: string;
    contentLabel: string;
    previewKicker: string;
    previewTitle: string;
    directionLabel: string;
    action: string;
  }
> = {
  fr: {
    interfaceLabel: "Langue de l’interface",
    contentLabel: "Langue du contenu",
    previewKicker: "Prévisualisation",
    previewTitle: "Votre icône est prête",
    directionLabel: "Direction créative générée",
    action: "Voir la prévisualisation",
  },
  en: {
    interfaceLabel: "Interface language",
    contentLabel: "Content language",
    previewKicker: "Preview",
    previewTitle: "Your icon is ready",
    directionLabel: "Generated creative direction",
    action: "View preview",
  },
  de: {
    interfaceLabel: "Sprache der Oberfläche",
    contentLabel: "Sprache des Inhalts",
    previewKicker: "Vorschau",
    previewTitle: "Dein Icon ist bereit",
    directionLabel: "Generierte kreative Richtung",
    action: "Vorschau ansehen",
  },
  es: {
    interfaceLabel: "Idioma de la interfaz",
    contentLabel: "Idioma del contenido",
    previewKicker: "Vista previa",
    previewTitle: "Tu icono está listo",
    directionLabel: "Dirección creativa generada",
    action: "Ver la vista previa",
  },
  pt: {
    interfaceLabel: "Idioma da interface",
    contentLabel: "Idioma do conteúdo",
    previewKicker: "Pré-visualização",
    previewTitle: "Seu ícone está pronto",
    directionLabel: "Direção criativa gerada",
    action: "Ver prévia",
  },
  ja: {
    interfaceLabel: "インターフェースの言語",
    contentLabel: "コンテンツの言語",
    previewKicker: "プレビュー",
    previewTitle: "アイコンの準備ができました",
    directionLabel: "生成されたクリエイティブの方向性",
    action: "プレビューを見る",
  },
};

const contentCopy: Record<LanguageCode, { ready: string; direction: string }> =
  {
    fr: { ready: "Votre icône est prête", direction: "Une énergie créative" },
    en: { ready: "Your icon is ready", direction: "A creative spark" },
    de: { ready: "Dein Icon ist bereit", direction: "Kreativer Schwung" },
    es: { ready: "Tu icono está listo", direction: "Impulso creativo" },
    pt: { ready: "Seu ícone está pronto", direction: "Energia criativa" },
    ja: { ready: "アイコンの準備ができました", direction: "創造的な勢い" },
  };

const highlightedCells = new Set([
  "fr-fr",
  "fr-en",
  "fr-de",
  "fr-es",
  "fr-pt",
  "fr-ja",
  "en-fr",
  "en-en",
  "en-de",
  "en-es",
  "en-pt",
  "en-ja",
]);

function languageName(code: LanguageCode, locale: string) {
  const english = {
    fr: "French",
    en: "English",
    de: "German",
    es: "Spanish",
    pt: "Portuguese (BR)",
    ja: "Japanese",
  };
  return locale === "en"
    ? english[code]
    : languageOptions.find((language) => language.code === code)!.label;
}

function LanguageMosaic() {
  const t = useTranslations("blogSaas");
  return (
    <div
      className="blog-editorial-module blog-language-mosaic"
      aria-labelledby="blog-language-mosaic-title"
    >
      <div className="blog-editorial-module__header">
        <p className="blog-editorial-module__eyebrow">{t("mosaicEyebrow")}</p>
        <p
          id="blog-language-mosaic-title"
          className="blog-editorial-module__title"
        >
          {t("mosaicTitle")}
        </p>
        <p className="blog-editorial-module__intro">{t("mosaicIntro")}</p>
      </div>
      <div className="blog-language-mosaic__tiles" role="list">
        {languageOptions.map((language, index) => (
          <div
            className="blog-language-mosaic__tile"
            key={language.code}
            role="listitem"
            lang={language.code}
            style={{ "--tile-delay": `${index * 80}ms` } as CSSProperties}
          >
            <span>{language.label}</span>
            <strong>{language.phrase}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguagePairDemo() {
  const locale = useLocale();
  const t = useTranslations("blogSaas");
  const [interfaceLanguage, setInterfaceLanguage] = useState<LanguageCode>(
    locale === "en" ? "en" : "fr",
  );
  const [contentLanguage, setContentLanguage] = useState<LanguageCode>("ja");
  const ui = interfaceCopy[interfaceLanguage];
  const content = contentCopy[contentLanguage];

  return (
    <section
      className="blog-editorial-module blog-language-demo"
      aria-labelledby="blog-language-demo-title"
    >
      <div className="blog-editorial-module__header">
        <p className="blog-editorial-module__eyebrow">{t("demoEyebrow")}</p>
        <h3
          id="blog-language-demo-title"
          className="blog-editorial-module__title"
        >
          {t("demoTitle")}
        </h3>
        <p className="blog-editorial-module__intro">{t("demoIntro")}</p>
      </div>

      <div className="blog-language-demo__workbench">
        <div className="blog-language-demo__controls">
          <label
            className="blog-language-demo__control"
            htmlFor="interface-language"
          >
            <span>{t("interfaceLabel")}</span>
            <select
              id="interface-language"
              value={interfaceLanguage}
              onChange={(event) =>
                setInterfaceLanguage(event.target.value as LanguageCode)
              }
            >
              {languageOptions.map((language) => (
                <option
                  key={language.code}
                  value={language.code}
                  lang={locale === "en" ? "en" : language.code}
                >
                  {languageName(language.code, locale)}
                </option>
              ))}
            </select>
          </label>
          <label
            className="blog-language-demo__control"
            htmlFor="content-language"
          >
            <span>{t("contentLabel")}</span>
            <select
              id="content-language"
              value={contentLanguage}
              onChange={(event) =>
                setContentLanguage(event.target.value as LanguageCode)
              }
            >
              {languageOptions.map((language) => (
                <option
                  key={language.code}
                  value={language.code}
                  lang={locale === "en" ? "en" : language.code}
                >
                  {languageName(language.code, locale)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          className="blog-language-demo__preview"
          lang={interfaceLanguage}
          aria-live="polite"
        >
          <div className="blog-language-demo__preview-heading">
            <span className="blog-editorial-module__eyebrow">
              {ui.previewKicker}
            </span>
            <span className="blog-language-demo__status" aria-hidden="true">
              ●
            </span>
          </div>
          <div className="blog-language-demo__icon" aria-hidden="true">
            <Sparkles size={28} strokeWidth={1.4} />
          </div>
          <p className="blog-language-demo__headline">{ui.previewTitle}</p>
          <p className="blog-language-demo__direction">
            <span>{ui.directionLabel}</span>
            <strong lang={contentLanguage} key={contentLanguage}>
              {content.direction}
            </strong>
          </p>
        </div>
      </div>
      <p className="blog-editorial-module__note">{t("demoNote")}</p>
    </section>
  );
}

function LanguageMatrix() {
  const locale = useLocale();
  const t = useTranslations("blogSaas");
  const [activeCell, setActiveCell] = useState("fr-ja");
  const activeInterface = activeCell.split("-")[0] as LanguageCode;
  const activeContent = activeCell.split("-")[1] as LanguageCode;
  const activeIsHighlighted = highlightedCells.has(activeCell);

  return (
    <section
      className="blog-editorial-module blog-language-matrix"
      aria-labelledby="blog-language-matrix-title"
    >
      <span className="blog-language-matrix__metric" aria-hidden="true">
        36
      </span>
      <div className="blog-editorial-module__header blog-language-matrix__header">
        <p className="blog-editorial-module__eyebrow">{t("matrixEyebrow")}</p>
        <h3
          id="blog-language-matrix-title"
          className="blog-editorial-module__title"
        >
          {t("matrixTitle")}
        </h3>
        <p className="blog-editorial-module__intro">{t("matrixIntro")}</p>
      </div>

      <div className="blog-language-matrix__scroll" tabIndex={0}>
        <table>
          <caption className="sr-only">{t("matrixCaption")}</caption>
          <thead>
            <tr>
              <th scope="col" aria-label={t("matrixAxis")}>
                ↘
              </th>
              {languageOptions.map((language) => (
                <th scope="col" key={language.code}>
                  <abbr title={languageName(language.code, locale)}>
                    {language.code === "pt"
                      ? "BR"
                      : language.code.toUpperCase()}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {languageOptions.map((interfaceLanguage) => (
              <tr key={interfaceLanguage.code}>
                <th scope="row">
                  <abbr title={languageName(interfaceLanguage.code, locale)}>
                    {interfaceLanguage.code === "pt"
                      ? "BR"
                      : interfaceLanguage.code.toUpperCase()}
                  </abbr>
                </th>
                {languageOptions.map((contentLanguage) => {
                  const cellId = `${interfaceLanguage.code}-${contentLanguage.code}`;
                  const isHighlighted = highlightedCells.has(cellId);
                  const isActive = activeCell === cellId;
                  return (
                    <td key={cellId}>
                      <SurfaceButton
                        type="button"
                        className={`blog-language-matrix__cell${
                          isHighlighted
                            ? " blog-language-matrix__cell--highlighted"
                            : ""
                        }${
                          isActive ? " blog-language-matrix__cell--active" : ""
                        }`}
                        aria-pressed={isActive}
                        tabIndex={isActive ? 0 : -1}
                        aria-label={t("matrixCell", {
                          interface: languageName(
                            interfaceLanguage.code,
                            locale,
                          ),
                          content: languageName(contentLanguage.code, locale),
                          highlight: isHighlighted
                            ? t("matrixCellHighlight")
                            : "",
                        })}
                        onClick={() => setActiveCell(cellId)}
                        onKeyDown={(event) => {
                          const buttons = event.currentTarget
                            .closest("table")
                            ?.querySelectorAll<HTMLButtonElement>("button");
                          if (!buttons) return;
                          const current = Array.from(buttons).indexOf(
                            event.currentTarget,
                          );
                          const offsets: Record<string, number> = {
                            ArrowLeft: -1,
                            ArrowRight: 1,
                            ArrowUp: -6,
                            ArrowDown: 6,
                          };
                          let next = current;
                          if (event.key in offsets)
                            next = Math.max(
                              0,
                              Math.min(35, current + offsets[event.key]),
                            );
                          else if (event.key === "Home") next = 0;
                          else if (event.key === "End") next = 35;
                          else return;
                          event.preventDefault();
                          buttons[next].focus();
                          setActiveCell(
                            `${languageOptions[Math.floor(next / 6)].code}-${
                              languageOptions[next % 6].code
                            }`,
                          );
                        }}
                      >
                        <span aria-hidden="true">
                          {isHighlighted ? <Check size={12} /> : "·"}
                        </span>
                      </SurfaceButton>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="blog-language-matrix__legend">
        <span>
          <i />
          {t("matrixHighlighted")}
        </span>
        <span>
          <i />
          {t("matrixOther")}
        </span>
      </div>
      <p className="blog-language-matrix__selection" aria-live="polite">
        <strong>
          {languageName(activeInterface, locale)} /{" "}
          {languageName(activeContent, locale)}
        </strong>
        <span>
          {activeIsHighlighted
            ? t("matrixSelectedHighlight")
            : t("matrixSelectedOther")}
        </span>
      </p>
      <p className="blog-editorial-module__note">{t("matrixNote")}</p>
    </section>
  );
}

const funnelStages = [
  {
    label: "visitors",
    detail: "visitorsDetail",
    width: "100%",
  },
  {
    label: "signups",
    detail: "signupsDetail",
    width: "80%",
  },
  {
    label: "projects",
    detail: "projectsDetail",
    width: "60%",
  },
  {
    label: "customers",
    detail: "customersDetail",
    width: "40%",
  },
] as const;

function AcquisitionFunnel() {
  const t = useTranslations("blogSaas");
  return (
    <section
      className="blog-editorial-module blog-funnel"
      aria-labelledby="blog-funnel-title"
    >
      <div className="blog-editorial-module__header">
        <p className="blog-editorial-module__eyebrow">{t("funnelEyebrow")}</p>
        <h3 id="blog-funnel-title" className="blog-editorial-module__title">
          {t("funnelTitle")}
        </h3>
        <p className="blog-editorial-module__intro">{t("funnelIntro")}</p>
      </div>
      <ol className="blog-funnel__list">
        {funnelStages.map((stage, index) => (
          <li
            className="blog-funnel__stage"
            key={stage.label}
            style={
              {
                "--funnel-width": stage.width,
                "--stage-index": index,
              } as CSSProperties
            }
          >
            <span className="blog-funnel__number">0{index + 1}</span>
            <span>
              <strong>{t(stage.label)}</strong>
              <small>{t(stage.detail)}</small>
            </span>
          </li>
        ))}
      </ol>
      <p className="blog-editorial-module__note">{t("funnelNote")}</p>
    </section>
  );
}

type QuestionKey = "international" | "demand" | "capacity";

const decisionQuestions: Array<{ key: QuestionKey; label: string }> = [
  {
    key: "international",
    label: "questionInternational",
  },
  {
    key: "demand",
    label: "questionDemand",
  },
  {
    key: "capacity",
    label: "questionCapacity",
  },
];

function DecisionTree() {
  const t = useTranslations("blogSaas");
  const [answers, setAnswers] = useState<Record<QuestionKey, boolean | null>>({
    international: null,
    demand: null,
    capacity: null,
  });

  const recommendation = useMemo(() => {
    if (Object.values(answers).some((answer) => answer === null)) return null;

    if (answers.international && answers.capacity) {
      return {
        title: t("adviceInternationalTitle"),
        body: t("adviceInternationalBody"),
      };
    }

    if (answers.demand && answers.capacity) {
      return {
        title: t("adviceDemandTitle"),
        body: t("adviceDemandBody"),
      };
    }

    if (answers.demand || answers.international) {
      return {
        title: t("adviceArchitectureTitle"),
        body: t("adviceArchitectureBody"),
      };
    }

    return {
      title: t("adviceValidateTitle"),
      body: t("adviceValidateBody"),
    };
  }, [answers, t]);

  return (
    <section
      className="blog-editorial-module blog-decision-tree"
      aria-labelledby="blog-decision-title"
    >
      <div className="blog-editorial-module__header">
        <p className="blog-editorial-module__eyebrow">{t("decisionEyebrow")}</p>
        <h3 id="blog-decision-title" className="blog-editorial-module__title">
          {t("decisionTitle")}
        </h3>
        <p className="blog-editorial-module__intro">{t("decisionIntro")}</p>
      </div>

      <div className="blog-decision-tree__questions">
        {decisionQuestions.map((question, index) => (
          <fieldset key={question.key} className="blog-decision-tree__question">
            <legend>
              <span>0{index + 1}</span>
              {t(question.label)}
            </legend>
            <div className="blog-decision-tree__choices">
              {[true, false].map((value) => {
                const label = value ? t("yes") : t("no");
                const isSelected = answers[question.key] === value;
                return (
                  <SurfaceButton
                    type="button"
                    className={`blog-decision-tree__choice${
                      isSelected ? " blog-decision-tree__choice--selected" : ""
                    }`}
                    key={label}
                    aria-pressed={isSelected}
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.key]: value,
                      }))
                    }
                  >
                    {label}
                  </SurfaceButton>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="blog-decision-tree__result" aria-live="polite">
        {recommendation ? (
          <>
            <p className="blog-decision-tree__result-label">
              {t("recommendation")}
            </p>
            <p className="blog-decision-tree__result-title">
              {recommendation.title}
            </p>
            <p>{recommendation.body}</p>
          </>
        ) : (
          <p>{t("decisionPending")}</p>
        )}
      </div>
      {Object.values(answers).some((answer) => answer !== null) ? (
        <SurfaceButton
          type="button"
          className="blog-decision-tree__reset"
          onClick={() =>
            setAnswers({ international: null, demand: null, capacity: null })
          }
        >
          {t("restart")}
        </SurfaceButton>
      ) : null}
    </section>
  );
}

export default function InternationalisationArticleModule({
  variant,
}: {
  variant: ModuleVariant;
}) {
  switch (variant) {
    case "mosaic":
      return <LanguageMosaic />;
    case "demo":
      return <LanguagePairDemo />;
    case "matrix":
      return <LanguageMatrix />;
    case "funnel":
      return <AcquisitionFunnel />;
    case "decision":
      return <DecisionTree />;
    default:
      return null;
  }
}
