import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsvFilePath = path.join(__dirname, "full-spec.tsv");
const outputFilePath = path.join(__dirname, "pages/full-spec.mdx");

const outputDir = path.dirname(outputFilePath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const tsvContent = fs.readFileSync(tsvFilePath, "utf-8");

const lines = tsvContent.split("\n");

// const header = lines[0];

const columnNames = lines[1].split("\t");

const dataRows = lines.slice(2).filter((line) => line.trim() !== "");

let mdxContent = `# UINL v1.2 Full Specification

`;

const groupedByType = {};

dataRows.forEach((row) => {
  const columns = row.split("\t");
  const type = columns[0];

  if (!groupedByType[type]) {
    groupedByType[type] = [];
  }

  const rowData = {};
  columnNames.forEach((colName, index) => {
    rowData[colName] = columns[index] || "";
  });

  groupedByType[type].push(rowData);
});

mdxContent += `## Table of Contents\n\n`;
Object.keys(groupedByType).forEach((type) => {
  const anchor = type
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  mdxContent += `- [${type}](#${anchor})\n`;
});

mdxContent += `\n`;

Object.entries(groupedByType).forEach(([type, rows]) => {
  // const typeAnchor = type
  //   .toLowerCase()
  //   .replace(/\s+/g, "-")
  //   .replace(/[^\w-]/g, "");
  // mdxContent += `## ${type} {#${typeAnchor}}\n\n`;
  mdxContent += `## ${type}\n\n`;

  rows.forEach((row) => {
    const heading = row["Label"] || row["Grammar"];
    if (heading) {
      const formattedHeading = heading
        .replace(/->/g, "&rarr;")
        .replace(/<<[^>]+>>/g, (match) => `\`${match}\``);
      mdxContent += `### ${formattedHeading}\n\n`;

      if (row["Label"] && row["Grammar"] && row["Label"] !== row["Grammar"]) {
        mdxContent += `- **Grammar:** \`${row["Grammar"]}\`\n`;
      }

      if (row["Shorthand"]) {
        // mdxContent += `- **Shorthand:** \`${row["Shorthand"]}\`\n`;

        // const formattedShorthand = row["Shorthand"].replace(
        //   /<<[^>]+>>/g,
        //   (match) => `\`${match}\``
        // );
        mdxContent += `- **Shorthand:** \`${row["Shorthand"]}\`\n`;
      }

      if (row["Required"]) {
        mdxContent += `- **Required:** ${row["Required"]}\n`;
      }

      if (row["Description"]) {
        let description = row["Description"];

        // replace <= with &lt;=
        description = description
          .replace(/<=/g, "&lt;=")
          .replace(/">"/g, '"&gt;"')
          .replace(/"<"/g, '"&lt;"');

        // Split the text into parts: JSON and non-JSON
        const parts = [];
        let lastIndex = 0;

        // Find all JSON matches
        const jsonMatches = [
          ...description.matchAll(
            /((\[[^\}]{3,})?\{s*[^\}\{]{3,}?:.*\}([^\{]+\])?)/g
          ),
        ];

        jsonMatches.forEach((match) => {
          // Add text before JSON (if any)
          if (match.index > lastIndex) {
            const beforeText = description.slice(lastIndex, match.index);
            parts.push({
              type: "text",
              content: beforeText,
            });
          }

          // Add JSON part
          parts.push({
            type: "json",
            content: match[0],
          });

          lastIndex = match.index + match[0].length;
        });

        // Add remaining text after last JSON (if any)
        if (lastIndex < description.length) {
          parts.push({
            type: "text",
            content: description.slice(lastIndex),
          });
        }

        // Process each part appropriately
        const formattedParts = parts.map((part) => {
          if (part.type === "json") {
            // Wrap JSON with backticks, but don't modify <<...>> inside
            return `\`${part.content}\``;
          } else {
            // For non-JSON text, wrap <<...>> with backticks
            return part.content.replace(
              /<<[^>]+>>/g,
              (match) => `\`${match}\``
            );
          }
        });

        mdxContent += `- **Description:** ${formattedParts.join("")}\n`;
      }

      if (row["Notes"]) {
        // mdxContent += `- **Notes:** ${row["Notes"]}\n`;
        const formattedNotes = row["Notes"].replace(
          /<<[^>]+>>/g,
          (match) => `\`${match}\``
        );
        mdxContent += `- **Notes:** ${formattedNotes}\n`;
      }

      if (row["Examples"]) {
        mdxContent += `- **Examples:**\n`;
        const examples = row["Examples"].split("Ex:").filter((ex) => ex.trim());

        if (examples.length > 0) {
          examples.forEach((example) => {
            // mdxContent += `  - \`${example.trim()}\`\n`;

            const formattedExample = example
              .trim()
              .replace(/<<[^>]+>>/g, (match) => `\`${match}\``);
            mdxContent += `  - ${formattedExample}\n`;
          });
        } else {
          // mdxContent += `  - \`${row["Examples"]}\`\n`;
          const formattedExample = row["Examples"].replace(
            /<<[^>]+>>/g,
            (match) => `\`${match}\``
          );
          mdxContent += `  - ${formattedExample}\n`;
        }
      }

      mdxContent += `\n`;
    }
  });
});

fs.writeFileSync(outputFilePath, mdxContent);

console.log(`MDX file generated at: ${outputFilePath}`);
