import type { ProjectId } from "@/content/projects/types";
import IconiseIllustration from "./IconiseIllustration";
import SmartFlowIllustration from "./SmartFlowIllustration";
import SuggstIllustration from "./SuggstIllustration";
import TruthifyIllustration from "./TruthifyIllustration";

export function ProjectIllustration({
  projectId,
  className = "",
}: {
  projectId: ProjectId;
  className?: string;
}) {
  switch (projectId) {
    case "iconise":
      return <IconiseIllustration className={className} />;
    case "suggst":
      return <SuggstIllustration className={className} />;
    case "smartflow":
      return <SmartFlowIllustration className={className} />;
    case "truthify":
      return <TruthifyIllustration className={className} />;
    default:
      return null;
  }
}

export function getProjectIdFromImageId(
  imageId?: string,
): ProjectId | undefined {
  if (!imageId) return undefined;
  const projectId = imageId.replace(/-(?:hero|card)$/, "") as ProjectId;
  if (
    projectId === "iconise" ||
    projectId === "suggst" ||
    projectId === "smartflow" ||
    projectId === "truthify"
  ) {
    return projectId;
  }
  return undefined;
}
