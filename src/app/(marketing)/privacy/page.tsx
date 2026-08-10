export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Last updated: {new Date().toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-foreground/80">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Who we are
          </h2>
          <p className="mt-2">
            Arzuno Fitness (&quot;we&quot;, &quot;us&quot;) provides 1:1
            online coaching, including training and nutrition guidance. This
            policy explains what personal data we collect through this
            website and client portal, why we collect it, and what rights
            you have over it.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Data we collect
          </h2>
          <p className="mt-2">As a client, we collect and store:</p>
          <ul className="mt-2 list-disc pl-5">
            <li>Contact details: name, email address.</li>
            <li>
              Check-in data you submit weekly: body weight, steps,
              hydration, waist measurement, and (only if you choose to
              provide them) blood pressure and blood glucose readings.
            </li>
            <li>Progress photos you upload as part of a check-in.</li>
            <li>
              Answers to training, nutrition, and lifestyle questions in the
              check-in form.
            </li>
            <li>
              Coaching plans, comments, and any voice notes your coach sends
              you as feedback.
            </li>
          </ul>
          <p className="mt-2">
            Some of this — physical and health-related measurements, and
            photos — is &quot;special category data&quot; under UK GDPR. We
            only collect it because you choose to submit it as part of
            coaching, and treat it with the same care as any other health
            information.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Why we use it
          </h2>
          <p className="mt-2">
            We use your data to deliver the coaching service you&apos;ve
            signed up for: reviewing your progress, adjusting your training
            and nutrition plans, and communicating with you. We rely on your
            consent to process health-related data, and on performance of
            our coaching agreement with you for everything else.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            How we store it
          </h2>
          <p className="mt-2">
            Your data is stored using Supabase, a third-party database and
            file storage provider. Access to your check-ins, photos, and
            plans is restricted so that only you and your coach can view
            them — no other client can see your data, and vice versa.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            How long we keep it
          </h2>
          <p className="mt-2">
            We keep your data for as long as you&apos;re an active client,
            and for a reasonable period afterwards in case you resume
            coaching or need historical records. You can ask us to delete
            your data at any time (see &quot;Your rights&quot; below).
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Cookies
          </h2>
          <p className="mt-2">
            This site uses only strictly necessary cookies to keep you
            logged in securely. We don&apos;t use tracking or advertising
            cookies.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Your rights
          </h2>
          <p className="mt-2">
            Under UK GDPR, you have the right to access, correct, or delete
            your personal data, restrict or object to how we process it, and
            request a copy of it in a portable format. To exercise any of
            these rights, contact us using the details below. You can also
            complain to the UK Information Commissioner&apos;s Office (ICO)
            if you believe your data hasn&apos;t been handled properly.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">
            Contact us
          </h2>
          <p className="mt-2">
            For any questions about this policy or your data, contact us at{" "}
            <span className="font-medium text-foreground">
              [add your contact email]
            </span>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
