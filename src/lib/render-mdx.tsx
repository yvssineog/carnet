import { evaluate } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import * as runtime from "react/jsx-runtime";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

function Note({ children }: { children: React.ReactNode }) {
  return <aside className="note-callout">{children}</aside>;
}

const components = { Note };

export async function renderMdx(source: string) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, [rehypeShiki, { themes: { light: "github-light", dark: "github-dark" }, defaultColor: "dark" }], rehypeKatex],
  });
  return <Content components={components} />;
}
