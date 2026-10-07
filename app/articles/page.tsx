import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/format-date";

export const metadata = {
  title: "Articles",
  description: "Notes, essays, and deep-dives on full-stack development.",
};

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      subtitle: true,
      coverImage: true,
      publishedAt: true,
      tags: { select: { name: true, slug: true } },
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Articles</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Notes, essays, and deep-dives on full-stack development.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">
          No articles yet. Check back soon.
        </p>
      ) : (
        <ul className="space-y-10">
          {articles.map((article, index) => (
            <li key={article.slug}>
              <ArticleCard article={article} />
              {index < articles.length - 1 && <Separator className="mt-10" />}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

type ArticleCardProps = {
  article: {
    slug: string;
    title: string;
    subtitle: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    tags: { name: string; slug: string }[];
  };
};

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group">
      <Link href={`/articles/${article.slug}`} className="block">
        <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
          {article.title}
        </h2>
        {article.subtitle && (
          <p className="mt-2 text-muted-foreground">{article.subtitle}</p>
        )}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
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
  );
}

export const dynamic = "force-dynamic";
