import { getTranslations } from "next-intl/server";
import type { ProjectCardModel } from "@/content/projects/view-models";
import ProjectCard from "./ProjectCard";

export default async function ProjectArchiveGrid({
  projects,
}: {
  projects: ProjectCardModel[];
}) {
  const t = await getTranslations("projects");
  const labels = Object.fromEntries(
    [
      "openActions",
      "closeDialog",
      "projectActions",
      "viewDetails",
      "accessProject",
      "viewOnGithub",
    ].map((k) => [k, t(k)]),
  );
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} labels={labels} />
      ))}
    </div>
  );
}
