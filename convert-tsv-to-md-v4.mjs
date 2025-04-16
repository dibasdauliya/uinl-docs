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

function extractJSONObjects(text) {
  const results = [];
  let braceCount = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{" && (start === -1 || braceCount === 0)) {
      if (start === -1) start = i;
      braceCount++;
    } else if (text[i] === "{") {
      braceCount++;
    } else if (text[i] === "}") {
      braceCount--;

      if (braceCount === 0 && start !== -1) {
        const potentialJSON = text.substring(start, i + 1);
        results.push({
          text: potentialJSON,
          start: start,
          end: i + 1,
        });
        start = -1;
      }
    }
  }

  return results;
}

function formatTitle(str) {
  const parts = str.split(" ");

  const formatted = parts.map((part) => {
    const words = part.split("-");

    const capitalizedWords = words.map((word) => {
      if (word === word.toUpperCase() && word.length > 1) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    // if hyphens, join back with hyphens
    return capitalizedWords.join("-");
  });
  return formatted.join(" ");
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

Object.entries(groupedByType).forEach(([type, rows]) => {
  mdxContent += `## ${formatTitle(type)}\n\n`;

  //  track heading duplicates. if new do markdown heading else wrap w/ html tag
  const usedHeadings = new Set();

  rows.forEach((row) => {
    const heading = row["Label"] || row["Grammar"];
    if (heading) {
      const formattedHeading = heading
        .replace(/->/g, "→")
        .replace(/<<[^>]+>>/g, (match) => `\`${match.slice(2, -2)}\``);

      if (usedHeadings.has(formattedHeading)) {
        mdxContent += `<h3>${formatTitle(formattedHeading)}</h3>\n\n`;
      } else {
        mdxContent += `### ${formatTitle(formattedHeading)}\n\n`;
        usedHeadings.add(formattedHeading);
      }

      if (row["Label"] && row["Grammar"] && row["Label"] !== row["Grammar"]) {
        mdxContent += `- **Grammar:** \`${row["Grammar"]}\`\n`;
      }

      if (row["Shorthand"]) {
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
          .replace(/"<"/g, '"&lt;"')
          // escape image syntax to prevent Module not found: Can't resolve '`<<url>>`'  error
          .replace(/!\[(.*?)\]\((.*?)\)/g, "\\!\\[$1\\]\\($2\\)");

        // Split the text into parts: JSON and non-JSON
        const parts = [];
        let lastIndex = 0;

        // const jsonMatches = [
        //   ...description.matchAll(
        //     // /((\[[^\}]{3,})?\{s*[^\}\{]{3,}?:.*\}([^\{]+\])?)/g
        //     /\{(?:[^{}[\]"']|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\[(?:[^[\]"']|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')*\]|\{(?:[^{}[\]"']|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\[(?:[^[\]"']|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')*\])*\})*\}/g
        //   ),
        // ];

        const jsonMatches = extractJSONObjects(description);

        jsonMatches.forEach((match) => {
          // Add text before JSON (if any)
          if (match.start > lastIndex) {
            const beforeText = description.slice(lastIndex, match.start);
            parts.push({
              type: "text",
              content: beforeText,
            });
          }

          // Just add the JSON without trying to include trailing text
          parts.push({
            type: match.text.startsWith('"r":{') ? "reqInfo" : "json",
            content: match.text,
          });
          lastIndex = match.end;
        });

        if (lastIndex < description.length) {
          parts.push({
            type: "text",
            content: description.slice(lastIndex),
          });
        }

        const formattedParts = parts.map((part) => {
          if (part.type === "json") {
            return `\n\`\`\`json\n${part.content}\n\`\`\`\n`;
          } else {
            return part.content.replace(
              /<<[^>]+>>/g,
              (match) => `\`${match.slice(2, -2)}\``
            );
          }
        });

        mdxContent += `- **Description:** ${formattedParts.join("")}\n`;
      }

      if (row["Notes"]) {
        // mdxContent += `- **Notes:** ${row["Notes"]}\n`;
        const formattedNotes = row["Notes"].replace(
          /<<[^>]+>>/g,
          (match) => `\`${match.slice(2, -2)}\``
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
              .replace(/<<[^>]+>>/g, (match) => `\`${match.slice(2, -2)}\``);
            mdxContent += `  - ${formattedExample}\n`;
          });
        } else {
          // mdxContent += `  - \`${row["Examples"]}\`\n`;
          const formattedExample = row["Examples"].replace(
            /<<[^>]+>>/g,
            (match) => `\`${match.slice(2, -2)}\``
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
