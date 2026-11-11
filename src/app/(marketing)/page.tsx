import Link from "next/link";

const services = [
  {
    title: "Personalised training",
    description:
      "A programme built around your goals, equipment, and schedule. Not a generic template.",
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

const audiences = [
  {
    title: "Working professionals",
    description:
      "You've got a demanding job, a commute and a calendar that's already full. You want a plan that fits around that, not one that only works if you have a perfect week.",
  },
  {
    title: "Aspiring bodybuilders",
    description:
      "You're thinking about stepping on stage, or you're already working towards a show. You want structured prep from someone going through it themselves.",
  },
  {
    title: "Anyone ready to make a positive change",
    description:
      "Whether you're a complete beginner or have trained for years, you're ready to change how you train, eat and feel, and to put in the work to make it stick.",
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
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Who this coaching is for
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
            Coaching for people with a full life outside the gym.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {audiences.map((audience) => (
              <div key={audience.title}>
                <h3 className="font-medium">{audience.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
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
            Submit a coaching application and I&apos;ll get back to you, or
            book a free call if you&apos;d like to talk it through first.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/apply"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              Submit coaching application
            </Link>
            <Link
              href="/booking"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium transition hover:bg-white/5"
            >
              Need more info? Book a call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
