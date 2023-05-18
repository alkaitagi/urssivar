import MarkdownIt from "markdown-it";

export default function configureMarkdown(md: MarkdownIt) {
  renderText(md);
  renderAudioSample(md);
  renderHintSample(md);
  renderPhrase(md);

  md.use(require("markdown-it-attrs"));
  md.use(require("markdown-it-bracketed-spans"));
}

function rd(s: string, md: MarkdownIt) {
  s = md.render(s);
  const pf = "<p>";
  if (s.startsWith(pf)) s = s.substring(pf.length);
  const sf = "</p>\n";
  if (s.endsWith(sf)) s = s.substring(0, s.length - sf.length);
  return s;
}

function renderPhrase(md: MarkdownIt) {
  md.renderer.rules.table_open = function (tokens, idx, options, _, self) {
    if (!tokens[idx].attrGet("class")?.includes("ph")) {
      return self.renderToken(tokens, idx, options);
    }
    const table = tokens.slice(
      idx,
      idx + tokens.slice(idx).findIndex((t) => t.type === "table_close")
    );
    table[0].attrJoin("class", "hid");
    const content = parseTable(md, table);
    
    const flags = content[0].splice(1);
    const segments = content.splice(1).map(([h, ...t]) => {
      if (h) return [h];
      if (t.some((v) => v)) return t;
      return ["&nbsp;"];
    });
    const types = JSON.stringify(segments.map((s) => s.length === 1));

    return (
      `<p><Phrase :flags="${flags.length}" :types="${types}">` +
      flags.map((f, i) => `<template #f-${i}>${f}</template>`).join("") +
      segments
        .flatMap((vs, i) =>
          vs.map((v, j) => `<template #s-${i}-${j}>${v}</template>`)
        )
        .join("") +
      "</Phrase></p>" +
      self.renderToken(tokens, idx, options)
    );
  };
}

function renderAudioSample(md: MarkdownIt) {
  const mreg = require("markdown-it-regexp");
  md.use(
    mreg(/\$\<(.+?)\>\((.+?)\)/, ([, cont, url]) => {
      return `<Say url="${url}">${rd(cont, md)}</Say>`;
    })
  );
}

function renderText(md: MarkdownIt) {
  const mreg = require("markdown-it-regexp");
  md.use(
    mreg(/==(.+?)==/, ([, cont]) => `<span class="b">${rd(cont, md)}</span>`)
  );
  md.use(
    mreg(/--(.+?)--/, ([, cont]) => `<span class="b s">${rd(cont, md)}</span>`)
  );
}

function renderHintSample(md: MarkdownIt) {
  const mreg = require("markdown-it-regexp");
  md.use(
    mreg(/\#\<(.+?)\|(.+?)\>/, ([, cont, hint]) => {
      return (
        `<Word>` +
        rd(cont, md) +
        "<template #content>" +
        rd(hint, md) +
        "</template>" +
        "</Word>"
      );
    })
  );
}

function parseTable(md: MarkdownIt, tokens: any[]) {
  const rs: string[][] = [];
  for (const t of tokens) {
    if (t.type === "tr_open") {
      rs.push([]);
    } else if (t.type === "inline") {
      let c = rd(t.content, md);
      rs[rs.length - 1].push(c);
    }
  }
  return rs;
}
