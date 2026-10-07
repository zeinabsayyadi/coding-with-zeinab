import { LinkButton } from "@/app/components/link-button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Article not found</h1>
      <p className="mt-3 text-muted-foreground">
        The article you're looking for doesn't exist!
      </p>

      <LinkButton
        href="/admin/articles"
        variant="link"
        size="sm"
        className="mt-8"
      >
        Back to all articles
      </LinkButton>
    </main>
  );
}
