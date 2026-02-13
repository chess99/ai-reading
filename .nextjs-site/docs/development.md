# Development Guide

This project is a static-exported Next.js site. Content comes from `../books`, while the web app lives in `.nextjs-site`.

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
cd .nextjs-site
npm install
```

## Run In Development

```bash
npm run dev
```

- Local URL: `http://localhost:3000/ai-reading`
- Hot reload works for UI and content updates.
- Full-text search on `/search` uses Pagefind index files and is not available in pure dev mode.

## Build

```bash
npm run build
```

This command does two things:

1. Builds static pages into `out/`
2. Generates Pagefind index into `out/pagefind/`

## Preview Production Output

```bash
npm run preview
```

- Preview URL: `http://localhost:4173/ai-reading`
- This command mounts `out/` under `/ai-reading` locally, matching production basePath.
- Use this mode to verify full-text search behavior exactly as production.

## Deploy

Deploy the `out/` directory (including `out/pagefind/`) to static hosting.
