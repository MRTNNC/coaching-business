import type { Metadata } from "next";

const storeUrl = "https://payhip.com/ArzunoFitness";

const categories = [
  {
    name: "Recipes",
    description: "High-protein recipes that fit a normal working week.",
  },
  {
    name: "Training plans",
    description: "Structured programmes and templates to run on your own.",
  },
  {
    name: "Merch",
    description: "Arzuno clothing and accessories.",
  },
  {
    name: "Nose strips",
    description: "Nasal strips for training, sleep and recovery.",
  },
];

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Recipes, training plans, merch and nose strips from Arzuno Coaching.",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
      <p className="mt-4 max-w-2xl text-foreground/70">
        Recipes, training plans and kit. Digital products are delivered by
        email straight after purchase.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {categories.map((category) => (
          <a
            key={category.name}
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col rounded-2xl border border-black/10 p-6 transition hover:border-accent/60 dark:border-white/15"
          >
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <p className="mt-2 flex-1 text-foreground/70">
              {category.description}
            </p>
            <span className="mt-4 text-sm font-medium text-accent">
              Browse &rarr;
            </span>
          </a>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          Visit the shop
        </a>
      </div>
    </section>
  );
}
