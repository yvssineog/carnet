import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const notesDirectory = path.resolve(process.env.CARNET_NOTES_DIR ?? path.join(process.cwd(), "notes"));
const slugSegment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type NoteSummary = {
  slug: string;
  segments: string[];
  title: string;
};

export type Note = NoteSummary & { body: string };

function titleFromFrontmatter(data: Record<string, unknown>, file: string): string {
  if (typeof data.title !== "string" || !data.title.trim()) {
    throw new Error(`Note ${file} needs a nonempty title in its frontmatter.`);
  }
  return data.title.trim();
}

async function walk(directory: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else if (entry.isFile() && entry.name.endsWith(".mdx")) files.push(fullPath);
  }
  return files;
}

function segmentsFromFile(file: string): string[] {
  return path.relative(notesDirectory, file).replace(/\.mdx$/, "").split(path.sep);
}

export async function listNotes(): Promise<NoteSummary[]> {
  const files = await walk(notesDirectory);
  const notes = await Promise.all(files.map(async (file) => {
    const segments = segmentsFromFile(file);
    if (!segments.every((segment) => slugSegment.test(segment))) {
      throw new Error(`Note path ${file} must use lowercase kebab-case names.`);
    }
    const source = await readFile(file, "utf8");
    const { data } = matter(source);
    return { slug: segments.join("/"), segments, title: titleFromFrontmatter(data, file) };
  }));
  return notes.sort((a, b) => a.slug.localeCompare(b.slug, "en", { numeric: true }));
}

export async function getNote(segments: string[]): Promise<Note | null> {
  if (segments.length < 2 || !segments.every((segment) => slugSegment.test(segment))) return null;
  const file = path.join(notesDirectory, ...segments) + ".mdx";
  try {
    const { data, content } = matter(await readFile(file, "utf8"));
    return { slug: segments.join("/"), segments, title: titleFromFrontmatter(data, file), body: content };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export function labelFromSegment(segment: string): string {
  const withoutOrder = segment.replace(/^\d+-/, "");
  return withoutOrder.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}
