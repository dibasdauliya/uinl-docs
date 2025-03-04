import * as fs from "fs";
import * as path from "path";

const tsvFilePath = path.join(__dirname, "full-spec.tsv");
const outputFilePath = path.join(__dirname, "pages/full-spec.mdx");

const outputDir = path.dirname(outputFilePath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const tsvContent = fs.readFileSync(tsvFilePath, "utf-8");

const lines = tsvContent.split("\n");

const header = lines[0];

const columnNames = lines[1].split("\t");

const dataRows = lines.slice(2).filter((line) => line.trim() !== "");

let mdxContent = `# UINL v1.2 Full Specification

This document contains the complete specification for UINL v1.2.

## Table of Contents
- [Introduction](#introduction)
- [Specification](#specification)

## Introduction

UINL (Universal Interface Notation Language) is a protocol for communication between user interfaces and applications.

## Specification

| ${columnNames.join(" | ")} |
|${columnNames.map(() => "---").join("|")}|
`;
dataRows.forEach((row) => {
  const columns = row.split("\t");
  mdxContent += `| ${columns.map((col) => col || " ").join(" | ")} |\n`;
});

fs.writeFileSync(outputFilePath, mdxContent);

console.log(`MDX file generated at: ${outputFilePath}`);
