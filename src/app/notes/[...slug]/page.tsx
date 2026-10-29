import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/reader-shell";
import { getNote, labelFromSegment, listNotes } from "@/lib/notes";
import { renderMdx } from "@/lib/render-mdx";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateStaticParams() {
  if (process.env.NODE_ENV === "development") return [];
  const notes = await listNotes();
  return notes.map((note) => ({ slug: note.segments }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNote((await params).slug);
  return { title: note?.title ?? "Note not found" };
}

export default async function NotePage({ params }: Props) {
  const note = await getNote((await params).slug);
  if (!note) notFound();
  const notes = await listNotes();
  const content = await renderMdx(note.body);

  return (
    <ReaderShell notes={notes} activeSlug={note.slug}>
      <article className="mx-auto w-full max-w-[720px]">
        <p className="mb-4 text-xs font-medium text-muted">
          <span>{note.segments.slice(0, -1).map(labelFromSegment).join(" / ")}</span>
        </p>
        <h1 className="font-serif text-[clamp(2.3rem,5vw,3.8rem)] leading-[1.1] tracking-[-0.04em] text-balance">{note.title}</h1>
        <div className="mt-8 border-t border-line pt-8 md:mt-10 md:pt-10">
          <div className="prose-note">{content}</div>
        </div>
      </article>
    </ReaderShell>
  );
}
