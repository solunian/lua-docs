import { type PrismTheme } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// custom themes for code highlighting. catppucchin is worth it.
const latte: PrismTheme = {
  plain: {
    color: "#4c4f69",
    backgroundColor: "#eff1f5",
  },
  styles: [
    {
      types: ["variable", "regex"],
      style: {
        color: "#4C4F69",
      },
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#179299",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#9CA0B0",
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "inserted"],
      style: {
        color: "#40A02B",
      },
    },
    {
      types: ["char", "constant"],
      style: {
        color: "#EA76CB",
      },
    },
    {
      types: ["number", "builtin", "boolean", "changed"],
      style: {
        color: "#FE640B",
      },
    },
    {
      types: ["keyword", "tag"],
      style: {
        color: "#8839EF",
      },
    },
    {
      types: ["function"],
      style: {
        color: "#1E66F5",
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#DF8E1D",
        fontStyle: "italic",
      },
    },
    {
      types: ["attr-name", "selector", "deleted"],
      style: {
        color: "#D20F39",
      },
    },
    {
      types: ["property"],
      style: {
        color: "#1E66F5",
      },
    },
    {
      types: ["symbol"],
      style: {
        color: "#E64553",
      },
    },
  ],
};
const macchiato: PrismTheme = {
  plain: {
    color: "#cad3f5",
    backgroundColor: "#24273a",
  },
  styles: [
    {
      types: ["variable", "regex"],
      style: {
        color: "#CAD3F5",
      },
    },
    {
      types: ["punctuation", "operator"],
      style: {
        color: "#8BD5CA",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#6E738D",
        fontStyle: "italic",
      },
    },
    {
      types: ["string", "inserted"],
      style: {
        color: "#A6DA95",
      },
    },
    {
      types: ["char", "constant"],
      style: {
        color: "#F5BDE6",
      },
    },
    {
      types: ["number", "builtin", "boolean", "changed"],
      style: {
        color: "#F5A97F",
      },
    },
    {
      types: ["keyword", "tag"],
      style: {
        color: "#C6A0F6",
      },
    },
    {
      types: ["function"],
      style: {
        color: "#8AADF4",
        fontStyle: "italic",
      },
    },
    {
      types: ["class-name"],
      style: {
        color: "#EED49F",
        fontStyle: "italic",
      },
    },
    {
      types: ["attr-name", "selector", "deleted"],
      style: {
        color: "#ED8796",
      },
    },
    {
      types: ["property"],
      style: {
        color: "#8AADF4",
      },
    },
    {
      types: ["symbol"],
      style: {
        color: "#EE99A0",
      },
    },
  ],
};

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
        { to: "/docs/general", label: "general", position: "left" },
        { to: "/docs/standard-libraries/", label: "standard-libraries", position: "left" },
        { to: "/docs/c-api/", label: "c-api", position: "left" },
        { to: "/docs/auxiliary/", label: "auxiliary", position: "left" },
        { to: "/docs/about", label: "about", position: "left" },
        {
          label: "github",
          href: "https://github.com/solunian/lua-docs",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "docs",
          items: [
            { to: "/docs/general", label: "general" },
            { to: "/docs/standard-libraries", label: "standard-libraries" },
            { to: "/docs/c-api", label: "c-api" },
            { to: "/docs/auxiliary", label: "auxiliary" },
            { to: "/docs/about", label: "about" },
          ],
        },
        {
          title: "origin",
          items: [
            { label: "lua.org", href: "https://lua.org/" },
            { label: "manuals", href: "https://www.lua.org/manual/" },
            { label: "documentation", href: "https://lua.org/docs.html" },
          ],
        },
        {
          title: "other",
          items: [
            { label: "about", to: "docs/about" },
            { label: "github", href: "https://github.com/solunian/lua-docs" },
          ],
        },
      ],
      copyright: "built with dinosaurs!",
    },
    prism: {
      theme: latte,
      darkTheme: macchiato,
      additionalLanguages: ["lua"],
      // defaultLanguage: "lua",
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
