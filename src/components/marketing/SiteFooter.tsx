import Link from "next/link";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-foreground/60 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Arzuno Fitness. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="transition hover:text-foreground">
            Privacy Policy
          </Link>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
