# Emek E-LIBRARY

**A Valley Where Truth is Found.**

A public Christian digital library for Bible college students and others to study
theology, church history, and biblical studies — with a realistic page-flip reader
and a built-in AI study assistant.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS — single codebase for frontend and API routes
- **PostgreSQL** + **Prisma ORM** — schema in `prisma/schema.prisma`
- **Auth.js (NextAuth)** with the Credentials provider — email/password signup + JWT sessions
- **react-pageflip** — realistic page-turn animation for the book reader
- **Claude API** (`@anthropic-ai/sdk`) — the floating AI assistant widget, with `pgvector` for retrieval over the library

## Getting started

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Generate a `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

The app will be at http://localhost:3000.

## Project structure

```
prisma/
  schema.prisma       Database schema (users, categories, books, pages, embeddings, progress)
  seed.ts             Demo categories + public-domain books
src/
  app/                Next.js routes (pages + API routes)
  components/         Shared React components
  lib/                Server-side helpers (Prisma client, auth, AI)
```

## Build order

This project is scaffolded and built in stages:

1. Project structure, database schema, homepage (this commit)
2. Login/signup flow
3. Book catalog (browse/search/filter by category)
4. Page-flip book reader
5. Floating AI assistant widget

## Data model notes

- `Book.accessLevel` is `PUBLIC` or `RESTRICTED` today, so licensed content can be
  gated later (e.g. behind a paid tier or an institutional login) without a schema
  migration — just start setting some books to `RESTRICTED` and add an entitlement
  check where content is served.
- `BookEmbedding` stores chunked text + `pgvector` embeddings per book, used by the
  AI widget to answer questions from "the wider library," not just the open book.
  Run `CREATE EXTENSION IF NOT EXISTS vector;` on your Postgres database before
  migrating.

## Known items to address next

- **Dependency updates**: this scaffold pins Next.js 14.2.x for stability while building. `npm audit` currently flags several Next.js/PostCSS advisories that are only fixed by upgrading to Next 16 (a breaking major-version change). Before going live, budget time to evaluate that upgrade (or track 14.2.x patch releases) and re-test the reader and auth flow afterward.
- **AI retrieval is keyword-based, not semantic yet**: `src/lib/ai/retrieval.ts` uses Postgres `ILIKE` search so the assistant works with zero extra setup. The schema already has a `pgvector` column (`BookEmbedding.embedding`) for a real embeddings upgrade later — see the comment at the top of that file.
- **Page-flip reader expects per-page content**: each book needs `BookPage` rows (`imageUrl` for scanned pages, or `textContent` for born-digital text) before it's readable. `prisma/seed.ts` shows the shape; a real ingestion step (splitting a PDF into page images, or importing structured text) still needs to be built for adding books at scale.

## Deployment

- App: [Vercel](https://vercel.com) (recommended) — connect the repo, set the env
  vars above in the project settings.
- Database: [Neon](https://neon.tech) or [Supabase](https://supabase.com) — both
  have a free Postgres tier with `pgvector` support.
- Book page images / cover images: any S3-compatible storage (Cloudflare R2,
  Supabase Storage, AWS S3).
