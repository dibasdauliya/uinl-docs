import React from "react";
import "../components/globals.css";
import { useMDXComponents } from "nextra/mdx";

function MyApp({ Component, pageProps }) {
  const mdxComponents = useMDXComponents({
    code: (props) => {
      const { children, className } = props;

      if (typeof children === "string" && children.includes("<<")) {
        const processedContent = children.replace(/<<([^>]+)>>/g, (_, text) => {
          const href = text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
          return `<<<a class="nx-text-primary-600 contrast-more:!nx-text-primary-600 contrast-more:nx-text-gray-900" href="#${href}">${text}</a>>>`;
        });

        return (
          <code
            className={`${className || ""} grammar-notation`}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        );
      }

      return <code {...props}>{children}</code>;
    },
  });

  return <Component {...pageProps} components={mdxComponents} />;
}

export default MyApp;
