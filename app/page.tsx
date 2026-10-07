import Link from "next/link";
import { Mail, Rss } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format-date";
import { siteConfig } from "@/app/config/site";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkedInIcon } from "./components/icons/linkdin";
import { GitHubIcon } from "./components/icons/github";
import { LinkButton } from "./components/link-button";

export default async function HomePage() {
  const latestArticles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      slug: true,
      title: true,
      subtitle: true,
      publishedAt: true,
      tags: { select: { name: true, slug: true } },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Hero />
      <Separator className="my-16" />
      <LatestArticles articles={latestArticles} />
      <Separator className="my-16" />
      <Footer />
    </main>
  );
}

function Hero() {
  const { author } = siteConfig;

  return (
    <section className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
      <Avatar className="h-28 w-28 shrink-0 border">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback className="text-2xl">
          {author.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Hi, I&apos;m {author.name}.
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {author.role} · {author.location}
        </p>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {author.bio}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          <li>
            <LinkButton
              href={author.github}
              external
              variant="outline"
              size="sm"
            >
              <GitHubIcon className="mr-2 h-4 w-4" />
              GitHub
            </LinkButton>
          </li>
          <li>
            <LinkButton
              href={author.linkedin}
              external
              variant="outline"
              size="sm"
            >
              <LinkedInIcon className="mr-2 h-4 w-4" />
              LinkedIn
            </LinkButton>
          </li>
          <li>
            <LinkButton
              href={`mailto:${author.email}`}
              external
              variant="outline"
              size="sm"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </LinkButton>
          </li>
          <li>
            <LinkButton href="/rss.xml" external variant="outline" size="sm">
              <Rss className="mr-2 h-4 w-4" />
              RSS
            </LinkButton>
          </li>
        </ul>
      </div>
    </section>
  );
}

type LatestArticlesProps = {
  articles: {
    slug: string;
    title: string;
    subtitle: string | null;
    publishedAt: Date | null;
    tags: { name: string; slug: string }[];
  }[];
};

function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section>
      <header className="mb-8 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Latest articles
        </h2>
        <Link
          href="/articles"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          All articles →
        </Link>
      </header>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">
          No articles yet. Check back soon.
        </p>
      ) : (
        <ul className="space-y-8">
          {articles.map((article) => (
            <li key={article.slug}>
              <article className="group">
                <Link href={`/articles/${article.slug}`} className="block">
                  <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  {article.subtitle && (
                    <p className="mt-1.5 text-muted-foreground">
                      {article.subtitle}
                    </p>
                  )}
                </Link>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
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
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>
        © {new Date().getFullYear()} {siteConfig.author.name}
      </p>
      <p></p>
    </footer>
  );
}

export const dynamic = "force-dynamic";
