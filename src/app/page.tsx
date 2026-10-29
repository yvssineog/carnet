import Link from "next/link";
import { connection } from "next/server";
import { ReaderShell } from "@/components/reader-shell";
import { labelFromSegment, listNotes } from "@/lib/notes";

export default async function HomePage() {
  await connection();
  const notes = await listNotes();
  const courses = [...new Set(notes.map((note) => note.segments[0]))];

  return (
    <ReaderShell notes={notes}>
      <h1 className="sr-only">Course notes</h1>
      <div className="mx-auto max-w-[720px] space-y-10">
        {courses.map((course) => (
          <section key={course}>
            <h2 className="mb-4 font-serif text-2xl tracking-tight">{labelFromSegment(course)}</h2>
            <ul className="border-t border-line">
              {notes.filter((note) => note.segments[0] === course).map((note) => (
                <li key={note.slug} className="border-b border-line">
                  <Link href={`/notes/${note.slug}`} className="index-note flex min-h-14 items-center justify-between gap-4 rounded-sm py-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-accent">
                    <span>{note.title}</span><span aria-hidden="true" className="text-muted">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ReaderShell>
  );
}
