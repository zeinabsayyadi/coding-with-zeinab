import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { loginAction } from "../actions";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Admin login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        action={loginAction}
        className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6"
      >
        <div>
          <h1 className="text-lg font-semibold">Admin login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your password to continue.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {error === "invalid" && (
            <p className="text-sm text-destructive">Incorrect password.</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
