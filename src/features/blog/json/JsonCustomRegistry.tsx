import type { CustomModule, SaaSModuleName } from "@/lib/blog/json-types";
import { BlogModuleFrame } from "../design-system/BlogUI";
import InternationalisationArticleModule from "../InternationalisationArticleModules";
import styles from "../InternationalisationArticle.module.css";

/**
 * Registre statique des modules React. Le JSON ne contient ni HTML libre, ni chemin
 * d'import, ni code. Les widgets SaaS réutilisent exactement la logique historique.
 * Le scope CSS original est conservé uniquement dans un adaptateur isolé.
 */
const saasVariants: Record<
  SaaSModuleName,
  "mosaic" | "demo" | "matrix" | "funnel" | "decision"
> = {
  "saas-mosaic": "mosaic",
  "saas-language-demo": "demo",
  "saas-language-matrix": "matrix",
  "saas-acquisition-funnel": "funnel",
  "saas-decision-tree": "decision",
};

export function JsonCustomModule({
  module,
  placement = "block",
}: {
  module: CustomModule;
  placement?: "hero" | "block";
}) {
  switch (module.component) {
    case "metric-panel":
      return (
        <BlogModuleFrame
          title={module.props.label}
          tone="info"
          note={module.props.caption}
          titleAs={placement === "hero" ? "p" : "h3"}
        >
          <div className="blog-ds__json-metric">{module.props.value}</div>
        </BlogModuleFrame>
      );
    case "saas-mosaic":
    case "saas-language-demo":
    case "saas-language-matrix":
    case "saas-acquisition-funnel":
    case "saas-decision-tree":
      return (
        <div
          className={`${styles.page} blog-ds__saas-module-host`}
          data-module={module.component}
        >
          <InternationalisationArticleModule
            variant={saasVariants[module.component]}
          />
        </div>
      );
  }
}
