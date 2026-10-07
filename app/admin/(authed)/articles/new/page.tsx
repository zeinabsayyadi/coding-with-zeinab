import { createArticleAction } from "@/app/admin/actions";
import { ArticleForm } from "@/app/admin/article-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">New article</h1>
      </header>
      <ArticleForm action={createArticleAction} submitLabel="Create article" />
    </div>
  );
}
