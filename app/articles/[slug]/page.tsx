import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { highlighter } from "@/app/lib/shiki";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/app/lib/prisma";
import { formatDate } from "@/app/lib/format-date";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/app/components/link-button";
import { Giscus } from "@/app/components/giscus";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, subtitle: true, coverImage: true },
  });

  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.subtitle ?? undefined,
    openGraph: {
      title: article.title,
      description: article.subtitle ?? undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      tags: { select: { name: true, slug: true } },
    },
  });

  if (!article || !article.published) notFound();

  const referenceLinks = article.referenceLinks as {
    label: string;
    url: string;
  }[];
  const gallery = article.gallery as {
    url: string;
    alt?: string;
    caption?: string;
  }[];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <LinkButton
        href="/articles"
        variant="ghost"
        size="sm"
        className="mb-8 -ml-3"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        All articles
      </LinkButton>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
        {article.subtitle && (
          <p className="mt-3 text-lg text-muted-foreground">
            {article.subtitle}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          {article.publishedAt && (
            <time
              dateTime={article.publishedAt.toISOString()}
              className="text-muted-foreground"
            >
              {formatDate(article.publishedAt)}
            </time>
          )}
          {article.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag.slug}>
                  <Link href={`/tags/${tag.slug}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                    >
                      {tag.name}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="mb-10 w-full rounded-lg border"
        />
      )}

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            [
              rehypeShikiFromHighlighter,
              highlighter,
              {
                themes: { light: "github-light", dark: "github-dark" },
              },
            ],
          ]}
        >
          {article.content}
        </ReactMarkdown>
      </article>

      {gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((img, i) => (
              <figure key={i}>
                <img
                  src={img.url}
                  alt={img.alt ?? ""}
                  className="w-full rounded-lg border"
                />
                {img.caption && (
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {referenceLinks.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            References
          </h2>
          <ul className="list-disc space-y-1 pl-6 text-sm">
            {referenceLinks.map((ref, i) => (
              <li key={i}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4 hover:no-underline"
                >
                  {ref.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(article.projectUrl || article.githubUrl) && (
        <>
          <Separator className="my-12" />
          <div className="flex flex-wrap gap-3">
            {article.projectUrl && (
              <Button
                nativeButton={false}
                render={
                  <a
                    href={article.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                View project
              </Button>
            )}
            {article.githubUrl && (
              <Button
                nativeButton={false}
                render={
                  <a
                    href={article.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="outline"
              >
                View on GitHub
              </Button>
            )}
          </div>
        </>
      )}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Comments</h2>
        <Giscus />
      </section>
    </main>
  );
}

export const dynamic = "force-dynamic";
