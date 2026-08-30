import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Arzuno Coaching by email or Instagram.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
      <p className="mt-4 text-foreground/70">
        Got a question, or want to arrange something not covered above? Reach
        out directly.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <a
          href="mailto:m.cull@arzuno.co.uk"
          className="flex items-center justify-between rounded-xl border border-white/10 px-5 py-4 transition hover:bg-white/5"
        >
          <span className="font-medium">Email</span>
          <span className="text-foreground/70">m.cull@arzuno.co.uk</span>
        </a>
        <a
          href="https://www.instagram.com/martin_cull_fit/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-white/10 px-5 py-4 transition hover:bg-white/5"
        >
          <span className="font-medium">Instagram</span>
          <span className="text-foreground/70">Follow along</span>
        </a>
      </div>
    </section>
  );
}
