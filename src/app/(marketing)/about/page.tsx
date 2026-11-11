import Image from "next/image";
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
            Hi, my name is Martin. By day I&apos;m an FP&amp;A manager,
            working on budgets in the hundreds of millions, and in my spare
            time I&apos;m preparing to compete in bodybuilding, with my first
            show in September 2027.
          </p>
          <p className="mt-3 leading-relaxed text-foreground/80">
            I&apos;ve been training for years, and I treat it the way I treat
            my job: track everything, look at what the numbers say, and
            adjust. That&apos;s how I&apos;ve built my physique alongside a
            full-time career, and it&apos;s exactly what I help my clients
            do.
          </p>
          <p className="mt-3 leading-relaxed text-foreground/80">
            Because I know how valuable your time is, I keep my client
            numbers small and review every check-in personally, so you
            always get my full attention.
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
          <h2 className="text-xl font-semibold">My transformation</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">
            18 months, using the same approach I use with clients: train
            consistently, track the numbers, and adjust.
          </p>
          <Image
            src="/images/transformation.webp"
            alt="Martin's before and after transformation"
            width={1080}
            height={1350}
            sizes="(min-width: 768px) 448px, 100vw"
            className="mx-auto mt-5 w-full max-w-md rounded-2xl border border-white/10"
          />
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
