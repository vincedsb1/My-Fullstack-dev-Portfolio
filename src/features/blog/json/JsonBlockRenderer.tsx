import Image from "next/image";
import type { ReactNode } from "react";
import type { ArticleBlock, RichText } from "@/lib/blog/json-types";
import {
  BlogCallout,
  BlogAccordion,
  BlogFigure,
  BlogCodeSample,
  BlogInfoCard,
  BlogQuote,
} from "../design-system/BlogUI";
import JsonChecklist from "./JsonChecklist";
import YouTubeEmbed from "../YouTubeEmbed";
import { JsonCustomModule } from "./JsonCustomRegistry";

export function Rich({ nodes }: { nodes: RichText }) {
  return (
    <>
      {nodes.map((node, i) => {
        let content: ReactNode = node.text;
        if (node.code) content = <code>{content}</code>;
        if (node.italic) content = <em>{content}</em>;
        if (node.bold) content = <strong>{content}</strong>;
        if (node.link)
          content = (
            <a
              href={node.link.href}
              target={node.link.external ? "_blank" : undefined}
              rel={node.link.external ? "noopener noreferrer" : undefined}
            >
              {content}
            </a>
          );
        return <span key={i}>{content}</span>;
      })}
    </>
  );
}
export default function JsonBlockRenderer({
  blocks,
  locale = "fr",
}: {
  blocks: readonly ArticleBlock[];
  locale?: "fr" | "en";
}) {
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key}>
                <Rich nodes={block.content} />
              </p>
            );
          case "lead":
            return (
              <p key={key} className="blog-ds__lead">
                <Rich nodes={block.content} />
              </p>
            );
          case "highlight":
            return (
              <blockquote key={key} className="blog-ds__json-highlight">
                <Rich nodes={block.content} />
              </blockquote>
            );
          case "heading":
            return block.level === 3 ? (
              <h3 key={key} id={block.id} tabIndex={block.id ? -1 : undefined}>
                {block.text}
              </h3>
            ) : (
              <h4 key={key} id={block.id} tabIndex={block.id ? -1 : undefined}>
                {block.text}
              </h4>
            );
          case "list": {
            const items = block.items.map((nodes, i) => (
              <li key={i}>
                <Rich nodes={nodes} />
              </li>
            ));
            return block.ordered ? (
              <ol key={key} className="blog-ds__text-list">
                {items}
              </ol>
            ) : (
              <ul key={key} className="blog-ds__text-list">
                {items}
              </ul>
            );
          }
          case "quote":
            return (
              <BlogQuote key={key} attribution={block.attribution}>
                <Rich nodes={block.content} />
              </BlogQuote>
            );
          case "callout":
            return (
              <BlogCallout
                key={key}
                title={
                  block.title ??
                  (block.tone === "warning"
                    ? locale === "fr"
                      ? "Attention"
                      : "Warning"
                    : locale === "fr"
                    ? "À retenir"
                    : "Note")
                }
                tone={block.tone ?? "info"}
              >
                <JsonBlockRenderer blocks={block.blocks} locale={locale} />
              </BlogCallout>
            );
          case "cards":
            return (
              <div key={key} className="blog-ds__card-grid">
                {block.items.map((card, i) => (
                  <BlogInfoCard
                    key={i}
                    number={card.number}
                    title={card.title}
                    variant={block.variant}
                    description={<Rich nodes={card.description} />}
                    action={
                      card.href ? (
                        <a href={card.href} className="blog-ds__json-card-link">
                          {card.actionLabel ??
                            (locale === "fr"
                              ? "En savoir plus"
                              : "Learn more")}{" "}
                          →
                        </a>
                      ) : undefined
                    }
                  >
                    {card.blocks ? (
                      <JsonBlockRenderer blocks={card.blocks} locale={locale} />
                    ) : null}
                  </BlogInfoCard>
                ))}
              </div>
            );
          case "table":
            return (
              <div
                key={key}
                className="blog-ds__table-scroll"
                tabIndex={0}
                role="region"
                aria-label={block.caption}
              >
                <table className="blog-ds__table">
                  <caption>{block.caption}</caption>
                  <thead>
                    <tr>
                      {block.columns.map((col, i) => (
                        <th scope="col" key={i}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((text, j) =>
                          j === 0 ? (
                            <th key={j} scope="row">
                              {text}
                            </th>
                          ) : (
                            <td key={j}>{text}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "figure":
            return (
              <BlogFigure key={key} caption={block.caption}>
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={block.width ?? 1200}
                  height={block.height ?? 675}
                  sizes="(max-width: 760px) 100vw, 760px"
                  unoptimized={block.src.endsWith(".svg")}
                  className="blog-ds__json-image"
                />
              </BlogFigure>
            );
          case "code":
            return (
              <BlogCodeSample
                key={key}
                label={block.title ?? block.language}
                code={block.code}
                language={block.language}
                copyable={block.copyable}
              />
            );
          case "video":
            return (
              <div key={key} className="blog-ds__video">
                <YouTubeEmbed id={block.id} title={block.title} />
              </div>
            );
          case "checklist":
            return (
              <JsonChecklist
                key={key}
                storageKey={block.storageKey}
                items={block.items}
                locale={locale}
              />
            );
          case "accordion":
            return (
              <BlogAccordion
                key={key}
                items={block.items.map((item) => ({
                  title: item.title,
                  content: (
                    <JsonBlockRenderer blocks={item.blocks} locale={locale} />
                  ),
                }))}
              />
            );
          case "custom":
            return <JsonCustomModule key={key} module={block} />;
          default: {
            const exhaustive: never = block;
            throw new Error(`Bloc JSON sans rendu : ${String(exhaustive)}`);
          }
        }
      })}
    </>
  );
}
