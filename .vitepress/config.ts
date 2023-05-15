import { defineConfig } from "vitepress";
import { withPwa } from "@vite-pwa/vitepress";
import path from "path";
import { telegramSvg } from "./icons";
import { pwa } from "./pwa";
import MarkdownIt from "markdown-it";

const sidebarGuide = [
  {
    text: "Introduction",
    items: [
      { text: "Markdown Examples", link: "/guide/introduction" },
      { text: "Runtime API Examples", link: "/guide/api-examples" },
    ],
  },
  {
    text: "Essentials",
    items: [
      { text: "Markdown Examples", link: "/guide/ess3" },
      { text: "Runtime API Examples", link: "/guide/ess4" },
    ],
  },
  {
    text: "Essentials",
    items: [
      { text: "Markdown Examples", link: "/guide/ess1" },
      { text: "Runtime API Examples", link: "/guide/ess2" },
    ],
  },
];
const sidebarExamples = [
  {
    text: "Phrasebook",
    items: [
      { text: "Cha1", link: "/examples/phrasebook_1" },
      { text: "Cha2", link: "/examples/phrasebook_2" },
    ],
  },
  {
    text: "Stories",
    items: [
      { text: "Wise girl", link: "/examples/tale_1" },
      { text: "Three brothers", link: "/examples/tale_2" },
    ],
  },
];

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    pwa: pwa as any,
    vite: {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../components"),
        },
      },
    },
    base: "/urssivar/",

    title: "Urssivar",
    description: "Kaitag Language Standard",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: {
        light: "/logo-light.png",
        dark: "/logo-dark.png",
      },
      search: {
        provider: "local",
      },
      footer: {
        message: "Uvkhara vaxt akku.",
      },
      nav: [
        {
          text: "Guide",
          link: "/guide/introduction",
          activeMatch: "/guide/",
        },
        {
          text: "Examples",
          link: "/examples/phrasebook_1",
          activeMatch: "/examples/",
        },
        {
          text: "Apps",
          items: [
            {
              text: "Avdan: Cards for Kids",
              link: "https://play.google.com/store/apps/details?id=com.alkaitagi.avdan",
            },
            {
              text: "Bazur: Online Dictionary",
              link: "https://bazur.raxys.app/",
            },
            {
              text: "Yaziv: Script Converter",
              link: "https://yaziv.raxys.app/",
            },
          ],
        },
      ],

      sidebar: {
        "/guide/": sidebarGuide,
        "/examples/": sidebarExamples,
      },

      socialLinks: [
        {
          icon: { svg: telegramSvg },
          link: "https://t.me/urssivar",
        },
        { icon: "github", link: "https://github.com/alkaitagi/urssivar" },
      ],
    },

    markdown: {
      config: (md) => {
        handleHints(md);
        handleAudios(md);
        handleTable(md);

        md.use(require("markdown-it-attrs"));
        md.use(require("markdown-it-bracketed-spans"));
      },
    },
  })
);

function handleTable(md: MarkdownIt) {
  function parseTable(md: MarkdownIt, tokens: any[]) {
    const rs: string[][] = [];
    for (const t of tokens) {
      if (t.type === "tr_open") {
        rs.push([]);
      } else if (t.type === "inline") {
        let c = rend(t.content, md);
        rs[rs.length - 1].push(c);
      }
    }
    return rs;
  }

  const cont = require("markdown-it-container");
  md.use(cont, "phrase", {
    validate: function (params) {
      return params.trim().match(/^phrase/);
    },
    render: function (tokens, idx) {
      if (tokens[idx].nesting !== 1) return "-->\n";

      const sidx = tokens.slice(idx).findIndex((t) => t.type === "table_open");
      const eidx = tokens.slice(idx).findIndex((t) => t.type === "table_close");
      const table = parseTable(md, tokens.slice(idx + sidx, idx + eidx));
      const flags = table[0].splice(1);
      const segments = table.splice(1);
      const flagTs = flags
        .map((f, i) => `<template #f-${i}>${f}</template>`)
        .join("\n");
      const segmentTs: string[] = [];
      for (let i = 0; i < segments.length; i++) {
        for (let j = 0; j < segments[i].length; j++) {
          const s = segments[i][j];
          if (s) segmentTs.push(`<template #s-${i}-${j}>${s}</template>`);
        }
      }

      const segmPar = segments.map((s) => !!s[0]);
      return (
        `<Phrase :flags="${flags.length}" :segments="${JSON.stringify(
          segmPar
        )}">` +
        flagTs +
        segmentTs +
        "</Phrase>\n<!--"
      );
    },
  });
}

function handleHints(md: MarkdownIt) {
  const mreg = require("markdown-it-regexp");
  md.use(
    mreg(/\[(.+?)\|(.+?)\]/, (match) => {
      const [, c, h] = match;
      return `<Word h="${h}">${rend(c, md)}</Word>`;
    })
  );
}

function handleAudios(md: MarkdownIt) {
  md.renderer.rules.image = function (tokens, idx, options, _, self) {
    const token = tokens[idx];
    const src = token.attrs![0][1];
    if (src.endsWith(".m4a")) {
      return `<Say url="${src}">${rend(token.content, md)}</Say>`;
    }
    return self.renderToken(tokens, idx, options);
  };
}

function rend(s: string, md: MarkdownIt) {
  s = md.render(s);
  const pf = "<p>";
  if (s.startsWith(pf)) s = s.substring(pf.length);
  const sf = "</p>\n";
  if (s.endsWith(sf)) s = s.substring(0, s.length - sf.length);
  return s;
}
