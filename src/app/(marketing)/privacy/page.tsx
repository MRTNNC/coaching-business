import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Arzuno Coaching collects, uses, and protects your personal data.",
  alternates: {
    canonical: "/privacy",
  },
};

// Change this whenever the policy itself changes.
const LAST_UPDATED = "11 November 2026";

const headingClass = "text-base font-semibold text-foreground";

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-foreground/80">
        <div>
          <h2 className={headingClass}>Who I am</h2>
          <p className="mt-2">
            Arzuno Coaching is run by Martin Cull and provides 1:1 online
            coaching, including training and nutrition guidance. I&apos;m the
            data controller for the personal data described in this policy,
            which explains what I collect through this website, the coaching
            application form and coaching itself, why I collect it, and what
            rights you have over it.
          </p>
          <p className="mt-2">
            Coaching is currently only available to adults aged 18 and over,
            and I don&apos;t knowingly collect data from anyone younger.
          </p>
        </div>

        <div>
          <h2 className={headingClass}>Data I collect</h2>
          <p className="mt-2">
            <span className="font-medium text-foreground">
              When you get in touch or book a call:
            </span>{" "}
            your name, email address, phone number (if you give it) and your
            message, or the details you enter when booking a call.
          </p>
          <p className="mt-2">
            <span className="font-medium text-foreground">
              When you apply for coaching:
            </span>{" "}
            your answers to the application form, including:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              Contact and personal details: name, email, phone, age,
              location, occupation, height and bodyweight.
            </li>
            <li>Your goals, training history, nutrition and lifestyle.</li>
            <li>
              Health information: medical conditions, injuries, surgery,
              medication, allergies, and pregnancy.
            </li>
            <li>Your coaching preferences and consent choices.</li>
          </ul>
          <p className="mt-2">
            <span className="font-medium text-foreground">As a client:</span>
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              Check-in information you send me: bodyweight, steps,
              measurements, and (only if you choose to provide them) other
              health readings.
            </li>
            <li>Progress photos you send as part of a check-in.</li>
            <li>
              Your answers to training, nutrition, and lifestyle questions in
              check-ins.
            </li>
            <li>
              Coaching plans, comments, and any voice notes I send you as
              feedback.
            </li>
          </ul>
          <p className="mt-2">
            <span className="font-medium text-foreground">
              When you buy from the shop:
            </span>{" "}
            your name, email address and order details, and a delivery
            address for physical items.
          </p>
          <p className="mt-2">
            <span className="font-medium text-foreground">
              If you join my mailing list:
            </span>{" "}
            your name and email address.
          </p>
          <p className="mt-2">
            Health information, body measurements and photos are &quot;special
            category data&quot; under UK GDPR. I only collect them because
            you choose to provide them for coaching, and I treat them with
            extra care.
          </p>
        </div>

        <div>
          <h2 className={headingClass}>Why I use it</h2>
          <ul className="mt-2 list-disc pl-5">
            <li>
              To reply to enquiries, review applications and deliver the
              coaching you&apos;ve signed up for: reviewing your progress,
              adjusting your training and nutrition plans, and communicating
              with you. The lawful basis is taking steps to enter into, and
              then performing, our coaching agreement.
            </li>
            <li>
              To process health information and progress photos. The lawful
              basis is your explicit consent, which you give on the
              application form. You can withdraw it at any time, though I
              may not be able to coach you safely without it.
            </li>
            <li>
              To send marketing emails, such as news and offers, only if
              you&apos;ve opted in. You can unsubscribe at any time using the
              link in every email.
            </li>
            <li>
              To use progress photos in marketing, only if you&apos;ve given
              separate permission. They can be anonymised, and you can
              withdraw permission at any time.
            </li>
            <li>To keep financial records required by law.</li>
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>Who I share it with</h2>
          <p className="mt-2">
            I never sell your data. I use a small number of trusted
            providers to run the website and coaching service, who process
            data on my behalf:
          </p>
          <ul className="mt-2 list-disc pl-5">
            <li>Vercel: website hosting and privacy-friendly analytics.</li>
            <li>Resend: sending application and enquiry emails to me.</li>
            <li>Cal.com: booking calls.</li>
            <li>
              Payhip: shop purchases, with payments handled by Stripe or
              PayPal.
            </li>
            <li>Mailchimp: marketing emails, if you&apos;ve opted in.</li>
            <li>
              WhatsApp and the 1Fit coaching app: sending check-ins,
              progress photos, plans and messages during coaching.
            </li>
          </ul>
          <p className="mt-2">
            Some of these providers are based in, or store data in, the
            United States. Where data is transferred outside the UK, it is
            protected by appropriate safeguards, such as the UK&apos;s
            International Data Transfer Addendum or the UK-US Data Bridge.
          </p>
        </div>

        <div>
          <h2 className={headingClass}>How I store it</h2>
          <p className="mt-2">
            Your application, check-ins, photos, and plans are stored
            securely and only I can access them. No other client can see
            your data. Messages and photos sent over WhatsApp are end-to-end
            encrypted.
          </p>
        </div>

        <div>
          <h2 className={headingClass}>How long I keep it</h2>
          <ul className="mt-2 list-disc pl-5">
            <li>
              Client data: for as long as you&apos;re a client, and for 2
              years after coaching ends, in case you return.
            </li>
            <li>
              Applications and enquiries from people who don&apos;t go on to
              start coaching: 6 months.
            </li>
            <li>
              Mailing list details: until you unsubscribe.
            </li>
            <li>
              Payment and invoice records: as long as UK tax law requires
              (usually 6 years).
            </li>
          </ul>
          <p className="mt-2">
            You can ask me to delete your data sooner at any time (see
            &quot;Your rights&quot; below).
          </p>
        </div>

        <div>
          <h2 className={headingClass}>Cookies</h2>
          <p className="mt-2">
            This site doesn&apos;t set any cookies of its own. The analytics
            I use don&apos;t use cookies, and I don&apos;t use tracking or
            advertising cookies. The booking calendar and shop are provided
            by Cal.com and Payhip, which may set their own cookies needed
            for them to work.
          </p>
        </div>

        <div>
          <h2 className={headingClass}>Your rights</h2>
          <p className="mt-2">
            Under UK GDPR, you have the right to access, correct, or delete
            your personal data, restrict or object to how I process it,
            withdraw consent, and request a copy of it in a portable format.
            To exercise any of these rights, contact me using the details
            below, and I&apos;ll respond within one month. You can also
            complain to the UK Information Commissioner&apos;s Office (ICO)
            if you believe your data hasn&apos;t been handled properly.
          </p>
        </div>

        <div>
          <h2 className={headingClass}>Contact</h2>
          <p className="mt-2">
            For any questions about this policy or your data, email{" "}
            <a
              href="mailto:m.cull@arzuno.co.uk"
              className="font-medium text-foreground underline underline-offset-2"
            >
              m.cull@arzuno.co.uk
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
