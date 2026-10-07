import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <>
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-semibold">
              Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground"
              >
                Articles
              </Link>
              <Link
                href="/admin/articles/new"
                className="text-muted-foreground hover:text-foreground"
              >
                New
              </Link>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                View site
              </Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </>
  );
}
