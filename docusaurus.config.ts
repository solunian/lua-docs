import { themes as prismThemes } from "prism-react-renderer";
// import macchiato from "src/code-themes/macchiato";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "lua-docs",
  tagline: "aesthetic documentation for the coolest scripting language",
  favicon: "/img/lua.png",
  url: "https://lua-docs.vercel.app/",
  baseUrl: "/",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/solunian/lua-docs/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "lua-docs",
      logo: {
        alt: "Lua Icon",
        src: "img/lua.svg",
        srcDark: "img/luadark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },
        {
          href: "https://github.com/solunian/lua-docs",
          position: "right",
          className: "header-github-link",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "docs",
          items: [{ label: "Tutorial", to: "/docs/intro" }],
        },
        {
          title: "origin",
          items: [{ label: "lua.org", href: "https://lua.org/" }],
        },
        {
          title: "other",
          items: [{ label: "github", href: "https://github.com/solunian/lua-docs" }],
        },
      ],
      copyright: "built with docusaurus.",
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["lua"],
      // defaultLanguage: "lua",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
