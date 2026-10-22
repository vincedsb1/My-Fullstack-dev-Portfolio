export const designTokensRule = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      token:
        "Utiliser un token de rayon, surface ou ombre du système de design.",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== "className") return;
        const value =
          node.value?.type === "Literal"
            ? node.value.value
            : node.value?.expression?.type === "TemplateLiteral"
            ? node.value.expression.quasis
                .map((part) => part.value.raw)
                .join(" ")
            : "";
        if (
          typeof value === "string" &&
          /\b(?:rounded-\[|bg-\[#|shadow-\[)/.test(value)
        )
          context.report({ node, messageId: "token" });
      },
    };
  },
};
