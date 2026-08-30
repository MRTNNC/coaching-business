import type { Metadata } from "next";

const calComLink =
  process.env.NEXT_PUBLIC_CAL_COM_LINK ?? "https://cal.com";

export const metadata: Metadata = {
  title: "Book a Call",
  description:
    "Book a free intro call to discuss your goals and find the right Arzuno Coaching package for you.",
  alternates: {
    canonical: "/booking",
  },
};

export default function BookingPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Book a free call
      </h1>
      <p className="mt-4 text-foreground/70">
        Pick a time that works for you. We&apos;ll talk through your goals
        and figure out the right coaching package.
      </p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
        <iframe
          src={`${calComLink}?embed=true`}
          className="h-[720px] w-full"
          title="Book a call"
        />
      </div>
    </section>
  );
}
