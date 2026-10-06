import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Tag not found</h1>
      <p className="mt-3 text-muted-foreground">
        This tag doesn't exist, or no articles have been published with it yet.
      </p>
      <Button className="mt-8" render={<Link href="/articles" />}>
        Back to all articles
      </Button>
    </main>
  );
}
