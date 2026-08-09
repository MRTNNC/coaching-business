export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} Martin Cull Coaching. All rights reserved.</p>
      </div>
    </footer>
  );
}
