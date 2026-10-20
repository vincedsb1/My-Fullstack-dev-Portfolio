import type { ComponentType } from "react";
import type { ProjectLocale } from "./types.ts";

export interface ProjectCaseStudyMdxProps {
  components?: Record<string, ComponentType<unknown>>;
}

export type ProjectCaseStudyMdxComponent =
  ComponentType<ProjectCaseStudyMdxProps>;

/**
 * Explicit registry for published MDX bodies.
 *
 * The registry deliberately starts empty: no case study is publishable until
 * its repository audit, manifest and localized MDX have been reviewed. Adding
 * a published project means adding one explicit loader here, which keeps the
 * build graph deterministic and prevents an unpublished file from becoming an
 * indexable page by accident.
 */
const projectCaseStudyMdxLoaders: Partial<
  Record<
    `${ProjectLocale}:${string}`,
    () => Promise<{ default: ProjectCaseStudyMdxComponent }>
  >
> = {};

export async function loadProjectCaseStudyBody(
  locale: ProjectLocale,
  slug: string,
) {
  return projectCaseStudyMdxLoaders[`${locale}:${slug}`]?.();
}
