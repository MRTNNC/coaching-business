"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PlanType } from "@/lib/types";

interface SectionDraft {
  heading: string;
  itemsText: string;
}

export function PlanForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [planType, setPlanType] = useState<PlanType>("workout");
  const [sections, setSections] = useState<SectionDraft[]>([
    { heading: "", itemsText: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateSection(index: number, patch: Partial<SectionDraft>) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  function addSection() {
    setSections((prev) => [...prev, { heading: "", itemsText: "" }]);
  }

  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();

    const { data: existing } = await supabase
      .from("plans")
      .select("version")
      .eq("client_id", clientId)
      .eq("plan_type", planType)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextVersion = (existing?.version ?? 0) + 1;

    const content = {
      sections: sections
        .filter((s) => s.heading.trim())
        .map((s) => ({
          heading: s.heading.trim(),
          items: s.itemsText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        })),
    };

    const { error: insertError } = await supabase.from("plans").insert({
      client_id: clientId,
      plan_type: planType,
      title,
      content,
      version: nextVersion,
      sent_at: new Date().toISOString(),
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push(`/admin/clients/${clientId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          />
        </div>
        <div>
          <label htmlFor="planType" className="text-sm font-medium">
            Type
          </label>
          <select
            id="planType"
            value={planType}
            onChange={(e) => setPlanType(e.target.value as PlanType)}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
          >
            <option value="workout">Workout</option>
            <option value="nutrition">Nutrition</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="rounded-xl border border-black/10 p-4 dark:border-white/15"
          >
            <div className="flex items-center justify-between gap-2">
              <input
                placeholder="Section heading (e.g. Day 1 — Push)"
                value={section.heading}
                onChange={(e) =>
                  updateSection(index, { heading: e.target.value })
                }
                className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
              />
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="shrink-0 text-xs text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <textarea
              placeholder="One item per line (e.g. Bench press 4x8)"
              rows={4}
              value={section.itemsText}
              onChange={(e) =>
                updateSection(index, { itemsText: e.target.value })
              }
              className="mt-2 w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSection}
          className="self-start rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Add section
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Save & send plan"}
      </button>
    </form>
  );
}
