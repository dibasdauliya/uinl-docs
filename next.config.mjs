import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  mdxOptions: {
    // remarkPlugins: [remarkGrammar],
  },
});

const nextConfig = {
  output: "export",
  basePath: "/uinl-docs",
  images: {
    unoptimized: true,
  },
  distDir: "out",
};

export default withNextra(nextConfig);
