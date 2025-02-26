import { visit } from "unist-util-visit";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";

export function remarkGrammar() {
  return (tree) => {
    visit(tree, ["code", "inlineCode"], (node, index, parent) => {
      if (node.value?.includes("<<") && node.value?.includes(">>")) {
        const transformedValue = node.value.replace(
          /<<\[(.*?)\]>>/g,
          (_, content) => `<a href="#${content.toLowerCase()}">${content}</a>`
        );

        // Create a new mdast node
        const newNode = unified()
          .use(remarkParse)
          .use(remarkStringify)
          .processSync(transformedValue).data;

        // Replace the original node
        parent.children[index] = {
          type: "element",
          tagName: "code",
          properties: {
            className: ["grammar-notation"],
          },
          children: [
            {
              type: "text",
              value: transformedValue,
            },
          ],
        };
      }
    });
  };
}
