import "server-only";

import type { CSSProperties, ReactNode } from "react";
import type { Root, Element, ElementContent } from "hast";
import rehypePrettyCode from "rehype-pretty-code";
import CopyButton from "../CopyButton";

// Même coloriseur que le MDX, avec thèmes GitHub à contraste renforcé, exclusivement pendant le rendu
// serveur. Le JSON reste du texte : seuls les tokens produits ici deviennent JSX.
const highlight = rehypePrettyCode({
  theme: {
    light: "github-light-high-contrast",
    dark: "github-dark-high-contrast",
  },
  keepBackground: false,
});

function tokens(nodes: ElementContent[]): ReactNode {
  return nodes.map((node, index) => {
    if (node.type === "text") return node.value;
    if (node.type !== "element") return null;
    const style: Record<string, string> = {};
    for (const declaration of String(node.properties.style ?? "").split(";")) {
      const [name, value] = declaration.split(":");
      if (name && value) {
        const key = name.trim();
        if (
          ["color", "font-style", "font-weight", "text-decoration"].includes(
            key,
          ) ||
          key.startsWith("--shiki-")
        )
          style[
            key.startsWith("--")
              ? key
              : key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
          ] = value.trim();
      }
    }
    return (
      <span
        key={index}
        style={style as CSSProperties}
        data-line={"data-line" in node.properties ? "" : undefined}
      >
        {tokens(node.children)}
      </span>
    );
  });
}

export default async function BlogCodeSample({
  label,
  code,
  language = "text",
  copyable = true,
}: {
  label: string;
  code: string;
  language?: string;
  copyable?: boolean;
}) {
  const tree: Root = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "pre",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "code",
            properties: { className: [`language-${language}`] },
            children: [{ type: "text", value: code }],
          },
        ],
      },
    ],
  };
  // Le plugin ne lit pas VFile : son transformateur ne dépend que de cet arbre.
  if (highlight) await highlight(tree, undefined as never, () => {});
  function findCode(nodes: Root["children"]): Element | undefined {
    for (const node of nodes) {
      if (node.type !== "element") continue;
      if (node.tagName === "code") return node;
      const found = findCode(node.children);
      if (found) return found;
    }
  }
  const colored = findCode(tree.children);
  return (
    <div className="blog-ds__code" data-language={language}>
      <div className="blog-ds__code-toolbar">
        <span>{label}</span>
        {copyable ? <CopyButton code={code} /> : null}
      </div>
      <pre tabIndex={0} role="region" aria-label={label}>
        <code>{colored ? tokens(colored.children) : code}</code>
      </pre>
    </div>
  );
}
