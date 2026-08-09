"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ALL_CHECKIN_FIELDS,
  CLOSING_FIELDS,
  DAYS,
  GENERAL_FIELDS,
  NUTRITION_FIELDS,
  TRAINING_FIELDS,
  type CheckinFieldConfig,
} from "@/lib/checkinFields";
import type { CheckinResponses, DailyLogEntry, PhotoAngle } from "@/lib/types";

const photoAngles: PhotoAngle[] = ["front", "side", "back"];

const inputClass =
  "mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent";

function emptyResponses(): CheckinResponses {
  return Object.fromEntries(
    ALL_CHECKIN_FIELDS.map((field) => [field.key, ""]),
  ) as unknown as CheckinResponses;
}

function emptyDailyLog(): DailyLogEntry[] {
  return DAYS.map((day) => ({ day, weight: "", steps: "", hydration: "" }));
}

export function CheckinForm() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState("");
  const [dailyLog, setDailyLog] = useState<DailyLogEntry[]>(emptyDailyLog());
  const [waistCm, setWaistCm] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");
  const [responses, setResponses] = useState<CheckinResponses>(
    emptyResponses(),
  );
  const [photos, setPhotos] = useState<Partial<Record<PhotoAngle, File>>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateDailyLog(
    day: DailyLogEntry["day"],
    field: "weight" | "steps" | "hydration",
    value: string,
  ) {
    setDailyLog((prev) =>
      prev.map((entry) =>
        entry.day === day ? { ...entry, [field]: value } : entry,
      ),
    );
  }

  function updateResponse(key: keyof CheckinResponses, value: string) {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session expired — please log in again.");
      setSubmitting(false);
      return;
    }

    const { data: checkin, error: insertError } = await supabase
      .from("checkins")
      .insert({
        client_id: user.id,
        week_start: weekStart || null,
        waist_cm: waistCm ? Number(waistCm) : null,
        blood_pressure: bloodPressure || null,
        blood_glucose: bloodGlucose || null,
        daily_log: dailyLog,
        responses,
      })
      .select()
      .single();

    if (insertError || !checkin) {
      setError(insertError?.message ?? "Could not submit check-in.");
      setSubmitting(false);
      return;
    }

    for (const angle of photoAngles) {
      const file = photos[angle];
      if (!file) continue;

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${checkin.id}/${angle}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("checkin-photos")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError(`Photo upload failed (${angle}): ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      await supabase.from("checkin_photos").insert({
        checkin_id: checkin.id,
        storage_path: path,
        angle,
      });
    }

    setSubmitting(false);
    router.push("/portal/checkins");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <label htmlFor="weekStart" className="text-sm font-medium">
          Week starting (Tuesday)
        </label>
        <input
          id="weekStart"
          type="date"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <p className="text-sm font-medium">
          Daily bodyweight and steps (weigh and record every morning)
        </p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-foreground/60">
                <th className="pb-2 pr-2">Day</th>
                <th className="pb-2 pr-2">Weight (kg)</th>
                <th className="pb-2 pr-2">Steps</th>
                <th className="pb-2">Hydration</th>
              </tr>
            </thead>
            <tbody>
              {dailyLog.map((entry) => (
                <tr key={entry.day}>
                  <td className="py-1 pr-2 text-foreground/70">
                    {entry.day}
                  </td>
                  <td className="py-1 pr-2">
                    <input
                      type="number"
                      step="0.1"
                      value={entry.weight}
                      onChange={(e) =>
                        updateDailyLog(entry.day, "weight", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                  <td className="py-1 pr-2">
                    <input
                      type="number"
                      value={entry.steps}
                      onChange={(e) =>
                        updateDailyLog(entry.day, "steps", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                  <td className="py-1">
                    <input
                      type="text"
                      value={entry.hydration}
                      onChange={(e) =>
                        updateDailyLog(entry.day, "hydration", e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="waist" className="text-sm font-medium">
            Waist measurement (cm)
          </label>
          <input
            id="waist"
            type="number"
            step="0.1"
            value={waistCm}
            onChange={(e) => setWaistCm(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="bp" className="text-sm font-medium">
            Blood pressure (if applicable)
          </label>
          <input
            id="bp"
            type="text"
            placeholder="NA"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="glucose" className="text-sm font-medium">
            Blood glucose (if applicable)
          </label>
          <input
            id="glucose"
            type="text"
            placeholder="NA"
            value={bloodGlucose}
            onChange={(e) => setBloodGlucose(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <FieldSection
        title="General feedback"
        fields={GENERAL_FIELDS}
        responses={responses}
        onChange={updateResponse}
      />
      <FieldSection
        title="Training feedback"
        fields={TRAINING_FIELDS}
        responses={responses}
        onChange={updateResponse}
      />
      <FieldSection
        title="Nutrition feedback"
        fields={NUTRITION_FIELDS}
        responses={responses}
        onChange={updateResponse}
      />
      <FieldSection
        title="Wrap-up"
        fields={CLOSING_FIELDS}
        responses={responses}
        onChange={updateResponse}
      />

      <div>
        <p className="text-sm font-medium">Progress photos (optional)</p>
        <div className="mt-2 grid grid-cols-3 gap-4">
          {photoAngles.map((angle) => (
            <div key={angle}>
              <label
                htmlFor={`photo-${angle}`}
                className="block text-xs capitalize text-foreground/60"
              >
                {angle}
              </label>
              <input
                id={`photo-${angle}`}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhotos((prev) => ({
                    ...prev,
                    [angle]: e.target.files?.[0],
                  }))
                }
                className="mt-1 w-full text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit check-in"}
      </button>
    </form>
  );
}

function FieldSection({
  title,
  fields,
  responses,
  onChange,
}: {
  title: string;
  fields: CheckinFieldConfig[];
  responses: CheckinResponses;
  onChange: (key: keyof CheckinResponses, value: string) => void;
}) {
  return (
    <div>
      <h2 className="text-base font-medium">{title}</h2>
      <div className="mt-3 flex flex-col gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium">{field.label}</label>
            {field.type === "rating" ? (
              <select
                value={responses[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={inputClass}
              >
                <option value="">—</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                rows={2}
                value={responses[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={inputClass}
              />
            ) : (
              <input
                type="text"
                value={responses[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
