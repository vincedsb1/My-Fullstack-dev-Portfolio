import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { getProjectsPath } from "@/lib/projects/routes";
import type { Locale } from "@/i18n/routing";
export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("site");
  return (
    <main id="main" className="py-24">
      <Container>
        <p className="text-accent">404</p>
        <h1 className="mt-3 text-h1 font-bold">{t("notFound")}</h1>
        <p className="mt-5 text-lead text-content-muted">
          {t("notFoundDescription")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/${locale}`}>{t("home")}</ButtonLink>
          <ButtonLink href={getProjectsPath(locale)} variant="secondary">
            {t("projects")}
          </ButtonLink>
          <ButtonLink href="/fr/blog" variant="secondary">
            {t("blog")}
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
