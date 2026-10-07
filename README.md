# Coding with Zeinab

A personal blog and portfolio for full-stack development notes, essays, and deep-dives.

**Live site:** [coding-with-zeinab.vercel.app](https://coding-with-zeinab.vercel.app)

## Features

- **Articles** written in Markdown, stored in Postgres, rendered with syntax highlighting
- **Tags** for browsing articles by topic
- **RSS feed** at `/rss.xml` for readers who subscribe
- **Comments** powered by GitHub Discussions via Giscus
- **Dark mode** that respects the visitor's OS preference and can be toggled manually
- **Admin panel** with password auth for writing and publishing articles
- **SEO** — per-article metadata, Open Graph tags, and auto-discovered feed

## Tech Stack

| Layer               | Technology                                                                             |
| ------------------- | -------------------------------------------------------------------------------------- |
| Framework           | [Next.js 16](https://nextjs.org) (App Router, Server Components)                       |
| Language            | [TypeScript](https://www.typescriptlang.org)                                           |
| Database            | [PostgreSQL](https://www.postgresql.org)                                               |
| ORM                 | [Prisma 7](https://www.prisma.io) with the `@prisma/adapter-pg` driver                 |
| Styling             | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Base UI) |
| Syntax Highlighting | [Shiki](https://shiki.style) (synchronous core, JS regex engine)                       |
| Markdown            | [react-markdown](https://github.com/remarkjs/react-markdown) + `remark-gfm`            |
| Icons               | [Lucide](https://lucide.dev) + inline SVG for brand icons                              |
| Fonts               | Geist Sans / Geist Mono via `next/font`                                                |

## Prerequisites

- **Node.js** 20 or newer
- **pnpm** (`npm install -g pnpm` or via Corepack)
- **Git**

No local Postgres installation is required — this project uses **Prisma's local Postgres** for development, which runs in your terminal.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zeinabsayyadi/coding-with-zeinab.git
cd coding-with-zeinab
```

### 2. Install dependencies

```bash
pnpm install
```

The `postinstall` script automatically runs `prisma generate` to produce the Prisma Client in `app/generated/prisma`.

### 3. Start the local database

Open a dedicated terminal and run:

```bash
pnpm db:dev
```

This starts a local Prisma Postgres instance and prints two connection strings — one for the main database and one for the shadow database (used by Prisma during migrations).

Copy them into a new `.env` file in the project root:

```bash
DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable&connection_limit=10&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"
SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:51215/template1?sslmode=disable&connection_limit=10&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&socket_timeout=0"
```

> **Note:** The exact port numbers may differ on your machine. Use whatever `prisma dev` prints.

### 4. Add admin credentials

The admin panel uses a single password with an HMAC-signed cookie session. Generate a random signing secret:

```bash
openssl rand -hex 32
```

Add both to `.env`:

```bash
ADMIN_PASSWORD="choose-a-strong-password"
ADMIN_SECRET="paste-the-random-hex-here"
```

### 5. Apply the database schema

With `pnpm db:dev` still running in the other terminal, open a new terminal and run:

```bash
pnpm db:migrate
```

This applies all migrations in `prisma/migrations/` to your local database.

### 6. Seed optional sample data

```bash
pnpm db:seed
```

Creates two example articles and a few tags so you can see the UI immediately.

### 7. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin) — sign in with the password you set in `.env`.

## Available Scripts

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `pnpm dev`        | Start the Next.js dev server                        |
| `pnpm build`      | Production build                                    |
| `pnpm start`      | Run the production build locally                    |
| `pnpm lint`       | Run ESLint                                          |
| `pnpm db:dev`     | Start the local Prisma Postgres server              |
| `pnpm db:migrate` | Create and apply a migration (`prisma migrate dev`) |
| `pnpm db:studio`  | Open Prisma Studio against the local database       |
| `pnpm db:seed`    | Run the seed script                                 |

## Writing Articles

Sign in at `/admin` and use the article form. The form supports:

- **Markdown content** — headings, lists, links, images, tables, and fenced code blocks
- **Syntax highlighting** for `ts`, `tsx`, `js`, `jsx`, `json`, `bash`, `css`, `html`, `python`, `sql`, `prisma`, `markdown`, and `yaml`
- **Tags** — comma-separated; new tags are created automatically
- **Reference links** — one per line in `Label | https://url` format
- **Publish / unpublish** — drafts stay hidden until you toggle them live
