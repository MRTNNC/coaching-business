import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("sort_order")
    .returns<Package[]>();

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-4 max-w-2xl text-foreground/70">
        Every package includes a personalised plan, weekly check-ins, and
        direct feedback. Not sure which fits? Book a free call and we&apos;ll
        figure it out together.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {(packages ?? []).map((pkg) => (
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
            <p className="mt-4 flex-1 text-sm text-foreground/70">
              {pkg.description}
            </p>
            <Link
              href="/booking"
              className="mt-6 rounded-full bg-foreground px-4 py-2 text-center text-sm font-medium text-background transition hover:opacity-90"
            >
              Book a call
            </Link>
          </div>
        ))}
        {(!packages || packages.length === 0) && (
          <p className="text-sm text-foreground/60">
            Pricing packages haven&apos;t been set up yet.
          </p>
        )}
      </div>
    </section>
  );
}
