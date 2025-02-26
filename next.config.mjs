import nextra from "nextra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.cache = {
        type: "filesystem",
        cacheDirectory: path.resolve(__dirname, ".webpack_cache"),
        store: "pack",
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    return config;
  },
};

export default withNextra(nextConfig);
