"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PhotoAngle } from "@/lib/types";

const angles: PhotoAngle[] = ["front", "side", "back"];
const ratingOptions = [1, 2, 3, 4, 5];

export function CheckinForm() {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [energy, setEnergy] = useState("3");
  const [sleep, setSleep] = useState("3");
  const [adherence, setAdherence] = useState("3");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<Partial<Record<PhotoAngle, File>>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
        weight: weight ? Number(weight) : null,
        energy_rating: Number(energy),
        sleep_rating: Number(sleep),
        adherence_rating: Number(adherence),
        notes: notes || null,
      })
      .select()
      .single();

    if (insertError || !checkin) {
      setError(insertError?.message ?? "Could not submit check-in.");
      setSubmitting(false);
      return;
    }

    for (const angle of angles) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label htmlFor="weight" className="text-sm font-medium">
          Weight (kg)
        </label>
        <input
          id="weight"
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <RatingField label="Energy" value={energy} onChange={setEnergy} />
        <RatingField label="Sleep" value={sleep} onChange={setSleep} />
        <RatingField
          label="Adherence"
          value={adherence}
          onChange={setAdherence}
        />
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-medium">
          Anything your coach should know?
        </label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
        />
      </div>

      <div>
        <p className="text-sm font-medium">Progress photos</p>
        <div className="mt-2 grid grid-cols-3 gap-4">
          {angles.map((angle) => (
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

function RatingField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
      >
        {ratingOptions.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
