import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Martin Cull — finance professional by day, competing bodybuilder and 1:1 coach who builds training and nutrition plans around a demanding full-time career.",
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
          <h2 className="text-xl font-semibold">
            From spreadsheets to the stage
          </h2>
          <p className="mt-3 leading-relaxed text-foreground/80">
            I spend my working days in financial planning &amp; analysis, in
            and around budgets running into the hundreds of millions.
            It&apos;s structured, detail-driven work, and it turns out that
            mindset transfers straight to the gym.
          </p>
          <p className="mt-3 leading-relaxed text-foreground/80">
            Outside of the office, I&apos;m working toward a bodybuilding
            show in September 2027. I&apos;ve spent years building the
            physique and the knowledge behind it, not through shortcuts, but
            through consistent training, careful nutrition, and a genuine
            obsession with figuring out what actually works. I don&apos;t
            have a fitness industry background. What I have is years of
            hands-on experience, a finance professional&apos;s habit of
            tracking and adjusting what isn&apos;t working, and a full
            commitment to seeing this competition through.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Why I coach</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">
            Most fitness content online is made by people who train for a
            living and have unlimited time to do it. That&apos;s not most
            people&apos;s reality, and it wasn&apos;t mine either, building
            this around a demanding full-time career.
          </p>
          <p className="mt-3 leading-relaxed text-foreground/80">
            I coach working professionals and aspiring bodybuilders who want
            real structure without pretending they have endless time and
            energy. That means training and nutrition plans built around
            your actual life: your job, your schedule, your starting point,
            not a generic template.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">What coaching looks like</h2>
          <p className="mt-3 leading-relaxed text-foreground/80">
            Every client gets a plan built around their goals, their
            schedule, and where they&apos;re actually starting from, not a
            copy-paste program. That includes:
          </p>
          <ul className="mt-3 list-disc pl-5 leading-relaxed text-foreground/80">
            <li>Structured training programming, adjusted as you progress</li>
            <li>Nutrition guidance that fits your life rather than fighting it</li>
            <li>Regular check-ins to track what&apos;s working and adjust what isn&apos;t</li>
            <li>Honest, direct communication, no vague motivational filler</li>
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
