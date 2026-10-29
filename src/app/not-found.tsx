import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">404 / Note not found</p>
      <h1 className="mt-5 font-serif text-4xl tracking-tight">This page is missing.</h1>
      <p className="mt-3 text-muted">The note may have moved, or the address may be incorrect.</p>
      <Link href="/" className="mt-7 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent">Back to carnet</Link>
    </main>
  );
}
