import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactNode } from "react";
import CopyButton from "./CopyButton";
import YouTubeEmbed from "./YouTubeEmbed";

function CodeBlock({
  children,
  className,
  ...props
}: ComponentProps<"pre"> & { "data-language"?: string }) {
  const plainText = getTextContent(children);
  const language =
    props["data-language"] ?? className?.replace(/^language-/, "") ?? "code";

  return (
    <div className="blog-code-block">
      <div className="blog-code-toolbar">
        <span>{language}</span>
        <CopyButton code={plainText} />
      </div>
      <pre {...props} className={className}>
        {children}
      </pre>
    </div>
  );
}

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent(
      (node as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

function MdxImage({
  src,
  alt = "",
  width,
  height,
  ...props
}: ComponentProps<"img"> & { src?: string }) {
  if (!src) return null;
  const imageWidth = typeof width === "number" ? width : Number(width) || 1200;
  const imageHeight =
    typeof height === "number" ? height : Number(height) || 675;

  return (
    <Image
      src={src}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      sizes="(max-width: 760px) 100vw, 760px"
      className="my-8 block h-auto max-w-full rounded-xl"
      unoptimized={src.toLowerCase().endsWith(".svg")}
      title={props.title}
      loading={props.loading}
      decoding={props.decoding}
    />
  );
}

function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 675,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 760px) 100vw, 900px"
        className="h-auto max-w-full rounded-xl"
        unoptimized={src.toLowerCase().endsWith(".svg")}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function Diagram({
  src,
  alt,
  caption,
  width = 1200,
  height = 700,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-9 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 sm:p-6">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 760px) 100vw, 900px"
        unoptimized
        className="mx-auto h-auto max-w-full"
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function Callout({
  children,
  title,
  tone = "note",
}: {
  children: ReactNode;
  title?: string;
  tone?: "note" | "tip" | "warning";
}) {
  return (
    <aside className={`blog-callout blog-callout-${tone}`}>
      {title ? <p className="mb-2 font-semibold">{title}</p> : null}
      {children}
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
  img: MdxImage,
  Figure,
  Diagram,
  Callout,
  YouTubeEmbed,
};
