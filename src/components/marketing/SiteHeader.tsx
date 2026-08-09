import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/merch", label: "Merch" },
  { href: "/booking", label: "Book a call" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Martin Cull Coaching
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Client login
          </Link>
        </nav>
      </div>
    </header>
  );
}
