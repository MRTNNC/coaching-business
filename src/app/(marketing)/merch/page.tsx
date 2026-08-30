import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merch",
  description: "Arzuno Coaching merchandise — coming soon.",
  alternates: {
    canonical: "/merch",
  },
};

export default function MerchPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Merch</h1>
      <p className="mt-4 text-foreground/70">Coming soon.</p>
    </section>
  );
}
