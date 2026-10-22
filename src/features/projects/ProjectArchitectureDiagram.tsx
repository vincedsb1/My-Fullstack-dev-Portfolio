import {
  ArrowDown,
  ArrowRight,
  Boxes,
  Cloud,
  Code2,
  Cpu,
  Database,
  Globe2,
  Monitor,
  Network,
  Server,
  type LucideIcon,
} from "lucide-react";
import type {
  ProjectArchitectureContent,
  ProjectArchitectureNode,
} from "@/content/projects/types";

const icons: Record<string, LucideIcon> = {
  browser: Monitor,
  client: Monitor,
  api: Network,
  service: Server,
  worker: Cpu,
  async: Cpu,
  database: Database,
  storage: Database,
  cloud: Cloud,
  code: Code2,
  globe: Globe2,
  default: Boxes,
};

function getFeaturedNodes(architecture: ProjectArchitectureContent) {
  const configuredNodes = architecture.featuredNodeIds
    ?.map((id) => architecture.nodes.find((node) => node.id === id))
    .filter((node): node is ProjectArchitectureNode => Boolean(node));

  return (configuredNodes?.length ? configuredNodes : architecture.nodes).slice(
    0,
    4,
  );
}

function getConnectorLabel(
  architecture: ProjectArchitectureContent,
  from: ProjectArchitectureNode,
  to: ProjectArchitectureNode,
  index: number,
) {
  return (
    architecture.featuredEdgeLabels?.[index] ??
    architecture.edges.find(
      (edge) => edge.from === from.id && edge.to === to.id,
    )?.label ??
    architecture.edges.find(
      (edge) => edge.from === from.id && edge.to === to.id,
    )?.flow ??
    "flux"
  );
}

export default function ProjectArchitectureDiagram({
  architecture,
  title,
}: {
  architecture: ProjectArchitectureContent;
  title: string;
  relationLabel?: string;
  asyncFlowLabel?: string;
}) {
  const nodes = getFeaturedNodes(architecture);

  return (
    <section
      id="architecture"
      className="border-b border-neutral-200  py-24 dark:border-neutral-900 bg-surface-sunken md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* En-tête centré et chaîne des nœuds techniques. */}
        <div
          data-reveal
          className="mx-auto mb-14 max-w-3xl text-center md:mb-16"
        >
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-neutral-50 md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-content-muted dark:text-content-subtle md:text-lg">
            {architecture.description}
          </p>
        </div>

        <div className="flex flex-col items-stretch justify-center gap-3 md:flex-row md:items-center md:gap-2">
          {nodes.map((node, index) => {
            const Icon = icons[node.icon ?? node.type] ?? icons.default;
            const nextNode = nodes[index + 1];
            return (
              <div
                key={node.id}
                data-reveal
                data-reveal-delay={index * 60}
                className="flex min-w-0 flex-1 items-center gap-3 md:flex-col md:gap-2 lg:flex-row"
              >
                <article
                  className={`group flex min-h-36 min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-2xl border bg-white p-5 text-center shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-base ease-out   dark:bg-neutral-900 motion-reduce:transform-none motion-reduce:transition-none md:w-full ${
                    node.highlight
                      ? "border-red-500 ring-1 ring-red-500/30 "
                      : "border-neutral-200  dark:border-neutral-800 "
                  }`}
                >
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-base ease-out  motion-reduce:transition-none motion-reduce:transform-none ${
                      node.highlight
                        ? "bg-red-500/10 text-accent"
                        : "bg-neutral-100 text-content-muted dark:bg-neutral-800 dark:text-neutral-300"
                    }`}
                  >
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold leading-tight text-neutral-950 dark:text-neutral-50">
                      {node.label}
                    </h3>
                    <p className="mt-2 truncate text-xs font-semibold uppercase tracking-[0.14em] text-content-muted dark:text-content-subtle">
                      {node.technology ?? node.type}
                    </p>
                    <span className="sr-only">{node.role}</span>
                  </div>
                </article>
                {nextNode ? (
                  <div className="flex shrink-0 items-center justify-center text-neutral-300 dark:text-neutral-600">
                    <ArrowRight
                      className="hidden md:block"
                      size={20}
                      aria-hidden="true"
                    />
                    <ArrowDown
                      className="md:hidden"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="sr-only">
                      {getConnectorLabel(architecture, node, nextNode, index)}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <ul className="sr-only" aria-label={title}>
          {nodes.map((node, index) => (
            <li key={node.id}>
              {node.label}: {node.technology ?? node.type}. {node.role}
              {nodes[index + 1]
                ? ` ${getConnectorLabel(
                    architecture,
                    node,
                    nodes[index + 1],
                    index,
                  )}.`
                : ""}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
