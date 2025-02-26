import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";
import Footer from "./components/Footer";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s - UINL Docs",
      };
    }
  },

  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="UINL Docs" />
      <meta property="og:description" content="UINL Docs" />
    </>
  ),

  logo: <span>UINL Docs</span>,
  project: {
    link: "https://github.com/uinl/",
  },
  docsRepositoryBase: "https://github.com/uinl/uinl/",
  footer: {
    component: <Footer />,
  },
};

export default config;
