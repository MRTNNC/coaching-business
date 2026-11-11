import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Martin Cull - FP&A manager by day, preparing for a bodybuilding show in September 2027, and 1:1 coach for working professionals and aspiring bodybuilders.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">About me</h1>

      <div className="mt-10 flex flex-col gap-10">
        <div>
          <p className="leading-relaxed text-foreground/80">
            I&apos;m an FP&amp;A manager by day, working on budgets in the
            hundreds of millions. Outside work, I&apos;m preparing for a
            bodybuilding show in September 2027.
          </p>
          <p className="mt-3 leading-relaxed text-foreground/80">
            I&apos;ve been training for years, and I treat it the way I treat
            my job: track everything, look at what the numbers say, and
            adjust. That&apos;s how I&apos;ve built my physique alongside a
            full-time career, and it&apos;s how I coach.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Why I coach</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">
            Most fitness advice comes from people whose job is training. Most
            people have a different job, plus a commute, a family and only so
            many hours in the week. I coach working professionals and
            aspiring bodybuilders who want a plan built around that.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">What you get</h2>
          <ul className="mt-3 list-disc pl-5 leading-relaxed text-foreground/80">
            <li>
              A training programme written for your goals and schedule,
              updated as you progress
            </li>
            <li>
              Nutrition guidance that works on a normal week, not just a
              perfect one
            </li>
            <li>Regular check-ins to review progress and make changes</li>
            <li>Straight answers</li>
          </ul>
        </div>
      </div>

      <div className="mt-14 flex justify-center">
        <Link
          href="/booking"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          Book a free call
        </Link>
      </div>
    </section>
  );
}
