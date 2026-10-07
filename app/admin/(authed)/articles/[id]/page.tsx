import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateArticleAction } from "@/app/admin/actions";
import { ArticleForm } from "@/app/admin/article-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { tags: { select: { slug: true } } },
  });

  if (!article) notFound();

  const referenceLinks = (
    article.referenceLinks as { label: string; url: string }[]
  )
    .map((r) => `${r.label} | ${r.url}`)
    .join("\n");

  const action = updateArticleAction.bind(null, id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Edit article</h1>
      </header>
      <ArticleForm
        action={action}
        submitLabel="Save changes"
        initial={{
          title: article.title,
          slug: article.slug,
          subtitle: article.subtitle ?? "",
          content: article.content,
          coverImage: article.coverImage ?? "",
          projectUrl: article.projectUrl ?? "",
          githubUrl: article.githubUrl ?? "",
          referenceLinks,
          tags: article.tags.map((t) => t.slug).join(", "),
          published: article.published,
        }}
      />
    </div>
  );
}
