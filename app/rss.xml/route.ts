import { Feed } from "feed";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/app/config/site";

// export const revalidate = 3600;

export const dynamic = "force-dynamic";
export async function GET() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: {
      slug: true,
      title: true,
      subtitle: true,
      publishedAt: true,
      createdAt: true,
      tags: { select: { name: true, slug: true } },
    },
  });

  const feed = new Feed({
    title: siteConfig.title,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: "en",
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteConfig.author.name}`,
    feedLinks: {
      rss2: `${siteConfig.url}/rss.xml`,
    },
    author: {
      name: siteConfig.author.name,
      email: siteConfig.author.email,
      link: siteConfig.url,
    },
  });

  articles.forEach((article) => {
    const url = `${siteConfig.url}/articles/${article.slug}`;

    feed.addItem({
      title: article.title,
      id: url,
      link: url,
      description: article.subtitle ?? undefined,
      date: article.publishedAt ?? article.createdAt,
      category: article.tags.map((tag) => ({ name: tag.name })),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
