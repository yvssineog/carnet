import Link from "next/link";
import { labelFromSegment, type NoteSummary } from "@/lib/notes";
import { ThemeToggle } from "@/components/theme-toggle";

type Folder = { segment: string; children: Folder[]; notes: NoteSummary[] };

function buildTree(notes: NoteSummary[]): Folder[] {
  const roots: Folder[] = [];
  for (const note of notes) {
    let level = roots;
    for (const [index, segment] of note.segments.slice(0, -1).entries()) {
      let folder = level.find((item) => item.segment === segment);
      if (!folder) {
        folder = { segment, children: [], notes: [] };
        level.push(folder);
      }
      if (index === note.segments.length - 2) folder.notes.push(note);
      level = folder.children;
    }
  }
  return roots;
}

function FolderLinks({ folders, activeSlug, prefix = "" }: { folders: Folder[]; activeSlug?: string; prefix?: string }) {
  return (
    <ul className="space-y-1">
      {folders.map((folder) => {
        const folderPath = prefix ? `${prefix}/${folder.segment}` : folder.segment;
        const selected = activeSlug?.startsWith(`${folderPath}/`) ?? false;
        return (
          <li key={folderPath}>
            <details className="nav-folder" open={selected || !activeSlug}>
              <summary className="nav-folder-label">{labelFromSegment(folder.segment)}</summary>
              <div className="nav-folder-contents">
                {folder.children.length > 0 && <FolderLinks folders={folder.children} activeSlug={activeSlug} prefix={folderPath} />}
                {folder.notes.length > 0 && (
                  <ul className="space-y-0.5">
                    {folder.notes.map((note) => (
                      <li key={note.slug}>
                        <Link href={`/notes/${note.slug}`} aria-current={activeSlug === note.slug ? "page" : undefined} className="nav-note">
                          {note.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          </li>
        );
      })}
    </ul>
  );
}

function Navigation({ notes, activeSlug }: { notes: NoteSummary[]; activeSlug?: string }) {
  return (
    <nav aria-label="Course notes" className="reader-navigation">
      {notes.length > 0 ? <FolderLinks folders={buildTree(notes)} activeSlug={activeSlug} /> : <p className="text-sm text-muted">No notes yet.</p>}
    </nav>
  );
}

export function ReaderShell({ notes, activeSlug, children }: { notes: NoteSummary[]; activeSlug?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <header className="site-header border-b border-line/70">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="inline-flex min-h-11 items-center gap-3 rounded-md text-lg font-semibold tracking-[-0.035em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-[10px] border border-line bg-surface text-base font-serif italic text-accent">c</span>
            carnet
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto grid max-w-[1180px] gap-9 px-5 py-8 sm:px-8 md:grid-cols-[230px_minmax(0,1fr)] md:gap-14 md:py-12 lg:px-12">
        <aside className="hidden md:block">
          <div className="sticky top-8">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Library</p>
            <Navigation notes={notes} activeSlug={activeSlug} />
          </div>
        </aside>
        <details className="mobile-library rounded-xl border border-line bg-surface px-4 py-1 md:hidden">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between text-sm font-medium">Browse notes <span aria-hidden="true" className="text-accent">⌄</span></summary>
          <div className="border-t border-line py-4"><Navigation notes={notes} activeSlug={activeSlug} /></div>
        </details>
        <main id="content" className="min-w-0 pb-20">{children}</main>
      </div>
    </div>
  );
}
