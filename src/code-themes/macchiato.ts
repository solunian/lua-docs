import type { PrismTheme } from "prism-react-renderer";
const theme: PrismTheme = {
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
export default theme;
