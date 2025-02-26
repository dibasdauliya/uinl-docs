import nextra from "nextra";
// import { remarkGrammar } from "./lib/remarkGrammar.js"; // Note the .js extension

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  mdxOptions: {
    // remarkPlugins: [remarkGrammar],
  },
});

export default withNextra();
