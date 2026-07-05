<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a single Next.js 16 personal blog app (no database, no test framework). Standard commands live in `package.json` scripts: `npm run dev` (port 3000), `npm run build`, `npm run start`, `npm run lint`.

- Content is flat Markdown/data on the filesystem (`posts/`, `chatters/`, `moments/`, `data/`), read via `process.cwd()`. There are no migrations or services to stand up — just start the dev server.
- `npm run lint` currently reports pre-existing errors/warnings in the repo (mostly `react-hooks/set-state-in-effect`); these are not from your changes. Note `eslint` here exits 0 even with reported errors.
- `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so `npm run build` will NOT fail on TypeScript type errors — rely on `npm run lint` / manual review to catch issues.
- Optional env vars enable optional-only features and are safe to omit for core blog work: `DEEPSEEK_API_KEY` (AI cat chat at `/api/chat`) and `QWEATHER_KEY` (weather widget at `/api/weather`). Without them only those specific features fail; the rest of the site works.
