import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format-date";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkButton } from "@/app/components/link-button";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = await prisma.tag.findMany({ select: { slug: true } });
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const found = await prisma.tag.findUnique({
    where: { slug: tag },
    select: { name: true },
  });

  if (!found) return { title: "Tag not found" };

  return {
    title: `#${found.name}`,
    description: `Articles tagged with ${found.name}.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;

  const found = await prisma.tag.findUnique({
    where: { slug: tag },
    select: {
      name: true,
      slug: true,
      articles: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        select: {
          slug: true,
          title: true,
          subtitle: true,
          publishedAt: true,
        },
      },
    },
  });

  if (!found) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <LinkButton href="/articles" variant="ghost" size="sm">
        <ArrowLeft className="mr-2 h-4 w-4" />
        All articles
      </LinkButton>
      <header className="mb-12">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{found.name}</Badge>
          <span className="text-sm text-muted-foreground">
            {found.articles.length}{" "}
            {found.articles.length === 1 ? "article" : "articles"}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Articles tagged <span className="text-primary">#{found.name}</span>
        </h1>
      </header>

      {found.articles.length === 0 ? (
        <p className="text-muted-foreground">
          No published articles with this tag yet.
        </p>
      ) : (
        <ul className="space-y-10">
          {found.articles.map((article, index) => (
            <li key={article.slug}>
              <article className="group">
                <Link href={`/articles/${article.slug}`} className="block">
                  <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {article.title}
                  </h2>
                  {article.subtitle && (
                    <p className="mt-2 text-muted-foreground">
                      {article.subtitle}
                    </p>
                  )}
                </Link>
                {article.publishedAt && (
                  <time
                    dateTime={article.publishedAt.toISOString()}
                    className="mt-3 inline-block text-sm text-muted-foreground"
                  >
                    {formatDate(article.publishedAt)}
                  </time>
                )}
              </article>
              {index < found.articles.length - 1 && (
                <Separator className="mt-10" />
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
