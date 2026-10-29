# carnet

carnet is a minimalist, personal knowledge base for writing, organizing, and sharing course notes written in MDX.

## Run locally

```sh
bun install
bun run dev
```

Open `http://localhost:3000`. Use `bun run build` and `bun run typecheck` to check the project.

## Notes

Notes live in `notes/<course>/<optional chapter>/<note>.mdx`. Directory and file names use lowercase words separated by hyphens. A numeric prefix such as `01-` controls the natural listing order and is hidden from folder labels. Every note begins with frontmatter containing a title:

```mdx
---
title: A useful note title
---

The note body starts here.
```

The file path determines the URL. For example, `notes/carnet-guide/01-how-notes-work.mdx` appears at `/notes/carnet-guide/01-how-notes-work`.

`CARNET_NOTES_DIR` can point to a different absolute notes directory.
