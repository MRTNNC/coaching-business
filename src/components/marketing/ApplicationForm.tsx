"use client";

import { useState, type FormEvent } from "react";
import {
  APPLICATION_DECLARATIONS,
  APPLICATION_SECTIONS,
  type ApplicationFieldConfig,
} from "@/lib/applicationFields";

const inputClass =
  "mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm";

export function ApplicationForm({
  packageOptions,
  initialPackage,
}: {
  packageOptions: string[];
  initialPackage: string;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({
    package: initialPackage,
  });
  const [declarations, setDeclarations] = useState<Record<string, boolean>>(
    {},
  );
  const [signature, setSignature] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, declarations, signature, honeypot }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error ?? "Could not send your application. Please try again.",
      );
      setStatus("error");
      return;
    }

    setStatus("sent");
    window.scrollTo({ top: 0 });
  }

  if (status === "sent") {
    return (
      <div className="mt-10 rounded-2xl border border-white/15 p-6">
        <h2 className="text-xl font-semibold">Thanks, application sent</h2>
        <p className="mt-2 text-foreground/70">
          I&apos;ll read through your answers and get back to you by email,
          usually within a couple of days.
        </p>
      </div>
    );
  }

  function renderField(field: ApplicationFieldConfig) {
    const id = `apply-${field.key}`;
    const value = answers[field.key] ?? "";
    const options =
      field.key === "package"
        ? [...packageOptions, "Not sure yet"]
        : (field.options ?? []);

    if (field.type === "choice") {
      return (
        <fieldset key={field.key}>
          <legend className="text-sm font-medium">{field.label}</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm"
              >
                <input
                  type="radio"
                  name={field.key}
                  required={field.required}
                  checked={value === option}
                  onChange={() => setAnswer(field.key, option)}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    if (field.type === "yesno") {
      const detailsKey = `${field.key}_details`;
      return (
        <fieldset
          key={field.key}
          className="rounded-lg border border-white/10 p-4"
        >
          <legend className="sr-only">{field.label}</legend>
          <p className="text-sm font-medium">{field.label}</p>
          <div className="mt-2 flex gap-6 text-sm">
            {["Yes", "No"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.key}
                  required={field.required}
                  checked={value === option}
                  onChange={() => setAnswer(field.key, option)}
                />
                {option}
              </label>
            ))}
          </div>
          {value === "Yes" && (
            <input
              type="text"
              aria-label={`${field.label} Details`}
              placeholder="Details"
              value={answers[detailsKey] ?? ""}
              onChange={(event) => setAnswer(detailsKey, event.target.value)}
              className={inputClass}
            />
          )}
        </fieldset>
      );
    }

    return (
      <div key={field.key}>
        <label htmlFor={id} className="text-sm font-medium">
          {field.label}
        </label>
        {field.type === "textarea" ? (
          <textarea
            id={id}
            rows={3}
            required={field.required}
            value={value}
            onChange={(event) => setAnswer(field.key, event.target.value)}
            className={inputClass}
          />
        ) : field.type === "select" ? (
          <select
            id={id}
            required={field.required}
            value={value}
            onChange={(event) => setAnswer(field.key, event.target.value)}
            className={`${inputClass} bg-background`}
          >
            <option value="">Select…</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={field.type}
            required={field.required}
            value={value}
            onChange={(event) => setAnswer(field.key, event.target.value)}
            className={inputClass}
          />
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-12">
      {APPLICATION_SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="text-xl font-semibold">{section.title}</h2>
          {section.intro?.map((line) => (
            <p key={line} className="mt-2 text-sm text-foreground/70">
              {line}
            </p>
          ))}
          <div className="mt-5 flex flex-col gap-5">
            {section.fields.map(renderField)}
          </div>
        </div>
      ))}

      <div>
        <h2 className="text-xl font-semibold">7. Declaration and consent</h2>
        <div className="mt-5 flex flex-col gap-3">
          {APPLICATION_DECLARATIONS.map((declaration) => (
            <label
              key={declaration.key}
              className="flex items-start gap-3 text-sm text-foreground/80"
            >
              <input
                type="checkbox"
                required={declaration.required}
                checked={declarations[declaration.key] ?? false}
                onChange={(event) =>
                  setDeclarations((prev) => ({
                    ...prev,
                    [declaration.key]: event.target.checked,
                  }))
                }
                className="mt-1"
              />
              <span>{declaration.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-5">
          <label htmlFor="apply-signature" className="text-sm font-medium">
            Type your full name to sign
          </label>
          <input
            id="apply-signature"
            type="text"
            required
            value={signature}
            onChange={(event) => setSignature(event.target.value)}
            className={inputClass}
          />
        </div>
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

      <div className="flex flex-col gap-3">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Sending…" : "Submit application"}
        </button>
      </div>
    </form>
  );
}
