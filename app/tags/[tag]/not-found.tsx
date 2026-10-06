import { LinkButton } from "@/app/components/link-button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Tag not found</h1>
      <p className="mt-3 text-muted-foreground">
        This tag doesn't exist, or no articles have been published with it yet.
      </p>
      <LinkButton href="/articles" variant="ghost" size="sm">
        Back to all articles
      </LinkButton>
    </main>
  );
}
