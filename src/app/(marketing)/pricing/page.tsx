import Link from "next/link";
import type { Metadata } from "next";
import { AddonList } from "@/components/marketing/AddonList";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Coaching packages from £150/month, plus training and nutrition plans, contest prep, and one-off sessions.",
  alternates: {
    canonical: "/pricing",
  },
};

const addonSections = [
  {
    category: "plans",
    title: "Plans only",
    description:
      "A plan written specifically for you and your goals, to fit your lifestyle, with no ongoing check-ins. Select one to send an enquiry.",
  },
  {
    category: "contest_prep",
    title: "Contest prep",
    description:
      "Short, focused support in the run-up to a show. Select one to send an enquiry.",
  },
  {
    category: "one_off",
    title: "One-off sessions",
    description:
      "For whenever you don't want an ongoing package. Select one to send an enquiry and we'll arrange the details.",
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("sort_order")
    .returns<Package[]>();

  const plans = (packages ?? []).filter((pkg) => !pkg.is_addon);
  const addons = (packages ?? []).filter((pkg) => pkg.is_addon);

  const offerCatalogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Fitness and Nutrition Coaching",
    provider: {
      "@type": "ProfessionalService",
      name: "Arzuno Coaching",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Coaching Packages and Services",
      itemListElement: [...plans, ...addons].map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        ...(pkg.description ? { description: pkg.description } : {}),
        price: pkg.price,
        priceCurrency: "GBP",
      })),
    },
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogJsonLd) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-4 max-w-2xl text-foreground/70">
        Coaching packages include a personalised plan, weekly check-ins, and
        direct feedback. Not sure which fits? Book a free call and we&apos;ll
        figure it out together.
      </p>

      <h2 className="mt-12 text-2xl font-semibold tracking-tight">
        Coaching
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {plans.map((pkg) => (
          <div
            key={pkg.id}
            className="flex flex-col rounded-2xl border border-black/10 p-6 dark:border-white/15"
          >
            <h3 className="font-medium">{pkg.name}</h3>
            <p className="mt-4 text-3xl font-semibold">
              £{pkg.price}
              {pkg.billing_period && (
                <span className="text-base font-normal text-foreground/60">
                  /{pkg.billing_period}
                </span>
              )}
            </p>
            <p
              className={`mt-1 text-sm text-foreground/60 ${
                pkg.monthly_equivalent ? "" : "invisible"
              }`}
            >
              &asymp; £{pkg.monthly_equivalent ?? 0}/month equivalent
            </p>
            <p className="mt-4 flex-1 text-sm text-foreground/70">
              {pkg.description}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={`/apply?package=${encodeURIComponent(pkg.name)}`}
                className="rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground transition hover:opacity-90"
              >
                Submit coaching application
              </Link>
              <Link
                href="/booking"
                className="rounded-full border border-white/20 px-4 py-2 text-center text-sm font-medium transition hover:bg-white/5"
              >
                Need more info? Book a call
              </Link>
            </div>
          </div>
        ))}
        {plans.length === 0 && (
          <p className="text-sm text-foreground/60">
            Pricing packages haven&apos;t been set up yet.
          </p>
        )}
      </div>

      {addonSections.map((section) => {
        const items = addons.filter(
          (addon) => (addon.category ?? "one_off") === section.category,
        );
        if (items.length === 0) return null;
        return (
          <div key={section.category} className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <p className="mt-2 text-foreground/70">{section.description}</p>
            <AddonList addons={items} />
          </div>
        );
      })}
    </section>
  );
}
