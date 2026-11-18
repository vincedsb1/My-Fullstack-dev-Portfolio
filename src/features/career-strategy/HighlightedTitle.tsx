/**
 * Titre éditorial du questionnaire : corps régulier et passage surligné.
 * Les espaces fines françaises et l’insécable avant le dernier mot évitent les
 * ponctuations et les mots orphelins en fin de ligne.
 */
export function HighlightedTitle({
  text,
  highlight,
  locale,
}: {
  text: string;
  highlight: string;
  locale: string;
}) {
  const punctuated =
    locale === "fr" ? text.replace(/ (?=[!?:;])/g, "\u202f") : text;
  // Bind the last two words. Replacements keep the length, so the highlight is found in the source text.
  const title = punctuated.replace(/ (?=[^ ]+$)/, "\u00a0");
  const start = highlight ? text.indexOf(highlight) : -1;
  if (start < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, start)}
      <strong>{title.slice(start, start + highlight.length)}</strong>
      {title.slice(start + highlight.length)}
    </>
  );
}
