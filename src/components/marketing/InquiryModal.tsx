"use client";

import { useState, type FormEvent } from "react";

export function InquiryModal({
  service,
  onClose,
}: {
  service: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, email, message, honeypot }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not send your message. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-background p-6"
        onClick={(event) => event.stopPropagation()}
      >
        {status === "sent" ? (
          <>
            <h2 className="text-lg font-semibold">Thanks — message sent</h2>
            <p className="mt-2 text-sm text-foreground/70">
              We&apos;ll get back to you to arrange {service.toLowerCase()}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            >
              Close
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{service}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-xl leading-none text-foreground/60 transition hover:text-foreground"
              >
                &times;
              </button>
            </div>

            <div>
              <label htmlFor="inquiry-email" className="text-sm font-medium">
                Your email
              </label>
              <input
                id="inquiry-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="inquiry-message" className="text-sm font-medium">
                What would you like to arrange?
              </label>
              <textarea
                id="inquiry-message"
                required
                rows={4}
                placeholder="e.g. preferred date/time, anything else useful to know"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm"
              />
            </div>

            <input
              type="text"
              name="company"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {status === "submitting" ? "Sending…" : "Send enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
