import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="font-semibold">
            Coach admin
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-sm">
            <Link
              href="/admin"
              className="text-foreground/70 transition hover:text-foreground"
            >
              Clients
            </Link>
            <Link
              href="/admin/clients/new"
              className="text-foreground/70 transition hover:text-foreground"
            >
              Invite client
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
