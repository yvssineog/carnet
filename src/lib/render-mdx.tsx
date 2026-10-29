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
const compiledNotes = new Map<string, ReturnType<typeof evaluate>>();
const maxCompiledNotes = 32;

export async function renderMdx(source: string) {
  let compilation = compiledNotes.get(source);
  if (!compilation) {
    compilation = evaluate(source, {
      ...runtime,
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        rehypeKatex,
        [rehypeShiki, {
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: "dark",
          langs: [],
          lazy: true,
          fallbackLanguage: "text",
        }],
      ],
    });
    compiledNotes.set(source, compilation);
    if (compiledNotes.size > maxCompiledNotes) {
      compiledNotes.delete(compiledNotes.keys().next().value!);
    }
  }

  try {
    const { default: Content } = await compilation;
    return <Content components={components} />;
  } catch (error) {
    if (compiledNotes.get(source) === compilation) compiledNotes.delete(source);
    throw error;
  }
}
