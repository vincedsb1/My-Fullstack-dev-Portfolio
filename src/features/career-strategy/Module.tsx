import { getLocale } from "next-intl/server";
import manifest from "@/content/career-strategy/bundle-manifest.json";
import Trigger from "./Trigger";
export default async function CareerStrategyModule() {
  const locale = (await getLocale()) === "fr" ? "fr" : "en";
  return (
    <Trigger
      locale={locale}
      resourceUrl={manifest.urls[locale]}
      contentVersion={manifest.contentVersion}
    />
  );
}
