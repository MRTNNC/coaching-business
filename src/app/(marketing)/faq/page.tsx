import Link from "next/link";
import type { Metadata } from "next";

const faqs = [
  {
    question: "Who is coaching for?",
    answer:
      "Working professionals and aspiring bodybuilders who want a plan built around a real week: a job, a commute, a family and only so many hours to train.",
  },
  {
    question: "How does coaching work?",
    answer:
      "You get a training programme and nutrition guidance written for your goals and schedule. Each week you submit a check-in (bodyweight, steps, progress photos and how the week went), and I review it and update your plan.",
  },
  {
    question: "What's the difference between coaching and a plan only?",
    answer:
      "Coaching includes regular check-ins, feedback and plan updates as you progress. A plan only is written specifically for you and your goals, but has no ongoing check-ins, so you run it yourself.",
  },
  {
    question: "Do I need a gym membership?",
    answer:
      "Your plan is written around where you train and the equipment you have, whether that's a commercial gym or a home setup. Tell me what you have access to on the application form, and we'll review it together to make sure the plan works for you.",
  },
  {
    question: "How do I get started?",
    answer:
      "Submit a coaching application. It takes about 10 to 15 minutes and helps me work out whether we're a good fit and where your plan should start. Once I've read it, we'll have a call to go through your answers and agree your plan.",
  },
  {
    question: "Is there a minimum commitment?",
    answer:
      "Lifestyle Monthly has no fixed commitment beyond two weeks' notice to cancel. The Lifestyle 6 Month Block is a one-off payment for six months of coaching, at a lower monthly cost.",
  },
  {
    question: "How do I cancel?",
    answer:
      "Lifestyle Monthly needs two weeks' notice to cancel, and you'll be refunded for any unused portion. The Lifestyle 6 Month Block can be cancelled within 30 days of starting, with a refund for the unused portion; after 30 days it's non-refundable.",
  },
  {
    question: "Do you coach people preparing for a show?",
    answer:
      "Yes. I'm preparing for a show myself, and as well as ongoing coaching I offer Peak Week Only and 4-Week Rush Prep for competitors in the run-up to a show.",
  },
  {
    question: "Can I train with an injury or medical condition?",
    answer:
      "Often, yes. The application form asks about your health, and if anything needs checking I'll ask you to speak to your GP first. I'm a coach, not a medical professional, so coaching doesn't replace advice from your GP or physio.",
  },
  {
    question: "Is coaching online or in person?",
    answer:
      "Coaching is online, so you can be based anywhere. If you're near Nottingham, 1:1 workouts are available in person too.",
  },
  {
    question: "How do I get recipe packs and training plans from the shop?",
    answer:
      "They're digital downloads, sent to your email straight after you buy.",
  },
];

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about Arzuno Coaching: how coaching works, check-ins, plans only, contest prep, commitment and getting started.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">
        Frequently asked questions
      </h1>

      <div className="mt-10 flex flex-col gap-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-xl border border-white/10 px-5 py-4"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden
                className="text-xl leading-none text-foreground/60 transition group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-foreground/70">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-14 text-center">
        <p className="text-foreground/70">Still have a question?</p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
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
  );
}
