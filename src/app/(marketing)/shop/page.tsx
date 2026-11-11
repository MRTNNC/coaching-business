import Link from "next/link";
import type { Metadata } from "next";

const categories = [
  {
    name: "Recipe packs",
    description: "High-protein recipes that fit a normal working week.",
    href: "https://payhip.com/ArzunoFitness/collection/recipe-packs",
  },
  {
    name: "Training plans",
    description: "Structured programmes and templates to run on your own.",
    href: "https://payhip.com/ArzunoFitness/collection/training-plans",
  },
  {
    name: "Stretching & mobility plans",
    description: "Routines to move better, recover faster and stay injury-free.",
    href: "https://payhip.com/ArzunoFitness/collection/stretching-mobility-plans",
  },
  {
    name: "Merch",
    description: "Arzuno clothing, accessories and nasal strips.",
    href: "/shop/merch",
  },
];

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Recipe packs, training plans, stretching and mobility plans and merch from Arzuno Coaching.",
  alternates: {
    canonical: "/shop",
  },
};

const cardClass =
  "flex flex-col rounded-2xl border border-black/10 p-6 transition hover:border-accent/60 dark:border-white/15";

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
      <p className="mt-4 max-w-2xl text-foreground/70">
        Recipes, training plans and kit. Digital products are delivered by
        email straight after purchase.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {categories.map((category) => {
          const content = (
            <>
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="mt-2 flex-1 text-foreground/70">
                {category.description}
              </p>
              <span className="mt-4 text-sm font-medium text-accent">
                Browse &rarr;
              </span>
            </>
          );

          return category.href.startsWith("/") ? (
            <Link key={category.name} href={category.href} className={cardClass}>
              {content}
            </Link>
          ) : (
            <a
              key={category.name}
              href={category.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}
