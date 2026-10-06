import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";

import langBash from "shiki/langs/bash.mjs";
import langCss from "shiki/langs/css.mjs";
import langHtml from "shiki/langs/html.mjs";
import langJavaScript from "shiki/langs/javascript.mjs";
import langJson from "shiki/langs/json.mjs";
import langJsx from "shiki/langs/jsx.mjs";
import langMarkdown from "shiki/langs/markdown.mjs";
import langPrisma from "shiki/langs/prisma.mjs";
import langPython from "shiki/langs/python.mjs";
import langSql from "shiki/langs/sql.mjs";
import langTsx from "shiki/langs/tsx.mjs";
import langTypeScript from "shiki/langs/typescript.mjs";
import langYaml from "shiki/langs/yaml.mjs";

export const highlighter = createHighlighterCoreSync({
  themes: [githubDark, githubLight],
  langs: [
    langBash,
    langCss,
    langHtml,
    langJavaScript,
    langJson,
    langJsx,
    langMarkdown,
    langPrisma,
    langPython,
    langSql,
    langTsx,
    langTypeScript,
    langYaml,
  ],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
});
