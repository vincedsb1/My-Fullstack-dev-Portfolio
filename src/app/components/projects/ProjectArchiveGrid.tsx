import type { ProjectCatalogEntry } from "@/content/projects/types";
import ProjectCard from "./ProjectCard";

export default function ProjectArchiveGrid({
  projects,
}: {
  projects: ProjectCatalogEntry[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
