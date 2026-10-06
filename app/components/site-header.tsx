import Link from "next/link";
import { siteConfig } from "@/app/config/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight hover:text-primary"
        >
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/articles"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Articles
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
