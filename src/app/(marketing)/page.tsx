import Link from "next/link";

const services = [
  {
    title: "Personalised training",
    description:
      "A programme built around your goals, equipment, and schedule — not a generic template.",
  },
  {
    title: "Nutrition guidance",
    description:
      "Practical, sustainable nutrition coaching that fits your life, adjusted as you progress.",
  },
  {
    title: "Weekly check-ins",
    description:
      "Submit your weight, progress photos, and how the week went. Get feedback and plan updates in return.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Coaching that adapts to you
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70">
          1:1 online training and nutrition coaching with weekly check-ins,
          direct feedback, and plans that evolve as you do.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/booking"
            className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Book a free call
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-accent-secondary/40 px-6 py-3 text-sm font-medium transition hover:bg-accent-secondary/10"
          >
            See pricing
          </Link>
        </div>
      </section>

      <section className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            How coaching works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {services.map((service) => (
              <div key={service.title}>
                <h3 className="font-medium">{service.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/70">
            Book a free intro call and we&apos;ll figure out the right plan
            for your goals.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Book a free call
          </Link>
        </div>
      </section>
    </>
  );
}
