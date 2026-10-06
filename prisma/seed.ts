import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tags = await Promise.all(
    [
      { name: "Next.js", slug: "nextjs" },
      { name: "Prisma", slug: "prisma" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Career", slug: "career" },
    ].map((t) =>
      prisma.tag.upsert({
        where: { slug: t.slug },
        update: {},
        create: t,
      }),
    ),
  );

  const tagBySlug = Object.fromEntries(tags.map((t) => [t.slug, t]));

  await prisma.article.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      slug: "hello-world",
      title: "Hello, world",
      subtitle:
        "Why I'm starting a coding diary, and what I hope to write about.",
      published: true,
      publishedAt: new Date("2026-01-15"),
      content: `# Hello, world

This is the first post on **Coding with Zeinab**. I've been meaning to start a blog for a while, and this is finally it.

## Why a diary?

I learn best when I write things down. A diary forces me to slow down, explain my reasoning, and notice when I don't actually understand something.

Here's what I plan to write about:

- Deep dives into libraries and frameworks I use
- Post-mortems of bugs that cost me hours
- Notes on tools and workflows
- Occasional thoughts on the craft

## A small code sample

Here's a snippet of the Prisma client singleton I use in this very project:

\`\`\`ts
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
\`\`\`

The \`globalThis\` trick prevents a new connection pool from being created on every hot reload in development.

## What's next

I'll be publishing regularly. If you want to follow along, the [RSS feed](/rss.xml) is the best way.

> Written with care, and a lot of coffee.
`,
      tags: {
        connect: [
          { id: tagBySlug["nextjs"].id },
          { id: tagBySlug["prisma"].id },
        ],
      },
      referenceLinks: [
        { label: "Prisma docs", url: "https://www.prisma.io/docs" },
        { label: "Next.js docs", url: "https://nextjs.org/docs" },
      ],
      githubUrl: "https://github.com/your-username/coding-with-zeinab",
      projectUrl: "https://coding-with-zeinab.vercel.app",
    },
  });

  await prisma.article.upsert({
    where: { slug: "why-i-use-typescript" },
    update: {},
    create: {
      slug: "why-i-use-typescript",
      title: "Why I use TypeScript",
      subtitle: "A few concrete reasons, not another abstract argument.",
      published: true,
      publishedAt: new Date("2026-02-02"),
      content: `# Why I use TypeScript

I don't use TypeScript because it's popular. I use it because it has saved me from specific bugs, repeatedly.

## Bugs it catches

Here are the categories of mistakes TypeScript has caught in my own code:

1. Typos in property names
2. Forgetting to handle \`null\` or \`undefined\`
3. Passing the wrong shape to a function
4. Out-of-date call sites after a refactor

None of these are exotic. They're the everyday bugs that waste twenty minutes here and an hour there.

## A concrete example

Consider this function:

\`\`\`ts
type User = {
  id: string
  email: string
  nickname?: string
}

function greet(user: User) {
  return \`Hello, \${user.nickname.toUpperCase()}\`
}
\`\`\`

TypeScript refuses to compile this. \`nickname\` is optional, so it might be \`undefined\`. The fix is either a guard clause or a default value:

\`\`\`ts
function greet(user: User) {
  const name = user.nickname ?? user.email
  return \`Hello, \${name}\`
}
\`\`\`

## Where it doesn't help

TypeScript doesn't protect you from runtime data. If an API returns something unexpected, your types are a lie. That's why I still validate at the boundaries with Zod.

> Types are a design tool, not a proof.
`,
      tags: {
        connect: [
          { id: tagBySlug["typescript"].id },
          { id: tagBySlug["career"].id },
        ],
      },
      referenceLinks: [
        {
          label: "TypeScript handbook",
          url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        },
      ],
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
