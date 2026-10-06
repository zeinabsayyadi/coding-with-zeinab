import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Article not found</h1>
      <p className="mt-3 text-muted-foreground">
        The article you're looking for doesn't exist or hasn't been published
        yet.
      </p>
      <Button render={<Link href="/articles" />} className="mt-8">
        Back to all articles
      </Button>
    </main>
  );
}
