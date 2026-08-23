import Link from "next/link";
import type { Metadata } from "next";
import { AddonList } from "@/components/marketing/AddonList";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Coaching packages from £120/month, plus one-off training, nutrition, and bloodwork consultation sessions.",
};

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
        Every package includes a personalised plan, weekly check-ins, and
        direct feedback. Not sure which fits? Book a free call and we&apos;ll
        figure it out together.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {plans.map((pkg) => (
          <div
            key={pkg.id}
            className="flex flex-col rounded-2xl border border-black/10 p-6 dark:border-white/15"
          >
            <h2 className="font-medium">{pkg.name}</h2>
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
            <Link
              href="/booking"
              className="mt-6 rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              Book a call
            </Link>
          </div>
        ))}
        {plans.length === 0 && (
          <p className="text-sm text-foreground/60">
            Pricing packages haven&apos;t been set up yet.
          </p>
        )}
      </div>

      {addons.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Other services
          </h2>
          <p className="mt-2 text-foreground/70">
            One-off sessions, for whenever you don&apos;t want an ongoing
            package. Select one to send an email and we&apos;ll arrange the
            details.
          </p>
          <AddonList addons={addons} />
        </div>
      )}
    </section>
  );
}
