import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

const links = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/checkin", label: "New check-in" },
  { href: "/portal/checkins", label: "History" },
  { href: "/portal/plans", label: "My plans" },
];

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <Link href="/portal" className="font-semibold">
              Your coaching
            </Link>
            {profile?.full_name && (
              <p className="text-xs text-foreground/60">
                {profile.full_name}
              </p>
            )}
          </div>
          <nav className="flex flex-wrap items-center gap-5 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
