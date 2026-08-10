import type { ReactNode } from "react";
import {
  CLOSING_FIELDS,
  GENERAL_FIELDS,
  NUTRITION_FIELDS,
  TRAINING_FIELDS,
  type CheckinFieldConfig,
} from "@/lib/checkinFields";
import type {
  Checkin,
  CheckinPhoto,
  CheckinResponses,
  Comment,
} from "@/lib/types";

export function CheckinDetail({
  checkin,
  photos,
  photoUrls,
  comments,
  voiceNoteUrls,
  footer,
}: {
  checkin: Checkin;
  photos: CheckinPhoto[];
  photoUrls: Map<string, string>;
  comments: Comment[];
  voiceNoteUrls?: Map<string, string>;
  footer?: ReactNode;
}) {
  const hasDailyLog = checkin.daily_log?.some(
    (entry) => entry.weight || entry.steps || entry.hydration,
  );
  const hasMeasurements =
    checkin.waist_cm || checkin.blood_pressure || checkin.blood_glucose;

  return (
    <div className="rounded-2xl border border-black/10 p-6 dark:border-white/15">
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {checkin.week_start
            ? `Week of ${new Date(checkin.week_start).toLocaleDateString()}`
            : new Date(checkin.submitted_at).toLocaleDateString()}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            checkin.status === "reviewed"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
          }`}
        >
          {checkin.status === "reviewed" ? "Reviewed" : "Awaiting review"}
        </span>
      </div>

      {hasDailyLog && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-foreground/60">
                <th className="pb-2 pr-4">Day</th>
                <th className="pb-2 pr-4">Weight (kg)</th>
                <th className="pb-2 pr-4">Steps</th>
                <th className="pb-2">Hydration</th>
              </tr>
            </thead>
            <tbody>
              {checkin.daily_log.map((entry) => (
                <tr
                  key={entry.day}
                  className="border-t border-black/5 dark:border-white/10"
                >
                  <td className="py-1.5 pr-4 text-foreground/70">
                    {entry.day}
                  </td>
                  <td className="py-1.5 pr-4">{entry.weight || "—"}</td>
                  <td className="py-1.5 pr-4">{entry.steps || "—"}</td>
                  <td className="py-1.5">{entry.hydration || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMeasurements && (
        <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-foreground/60">Waist</dt>
            <dd>{checkin.waist_cm ? `${checkin.waist_cm} cm` : "—"}</dd>
          </div>
          <div>
            <dt className="text-foreground/60">Blood pressure</dt>
            <dd>{checkin.blood_pressure || "—"}</dd>
          </div>
          <div>
            <dt className="text-foreground/60">Blood glucose</dt>
            <dd>{checkin.blood_glucose || "—"}</dd>
          </div>
        </dl>
      )}

      <ResponseSection
        title="General feedback"
        fields={GENERAL_FIELDS}
        responses={checkin.responses}
      />
      <ResponseSection
        title="Training feedback"
        fields={TRAINING_FIELDS}
        responses={checkin.responses}
      />
      <ResponseSection
        title="Nutrition feedback"
        fields={NUTRITION_FIELDS}
        responses={checkin.responses}
      />
      <ResponseSection
        title="Wrap-up"
        fields={CLOSING_FIELDS}
        responses={checkin.responses}
      />

      {photos.length > 0 && (
        <div className="mt-4 flex gap-3">
          {photos.map((photo) => {
            const url = photoUrls.get(photo.id);
            return url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={url}
                alt={`${photo.angle} progress photo`}
                className="h-24 w-24 rounded-lg object-cover"
              />
            ) : null;
          })}
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
          <p className="text-xs font-medium text-foreground/60">Feedback</p>
          <ul className="mt-2 flex flex-col gap-2">
            {comments.map((comment) => {
              const voiceUrl = comment.voice_note_path
                ? voiceNoteUrls?.get(comment.id)
                : undefined;
              return (
                <li key={comment.id} className="text-sm">
                  <p>{comment.body}</p>
                  {voiceUrl && (
                    <audio
                      src={voiceUrl}
                      controls
                      className="mt-1 h-8 w-full max-w-xs"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {footer}
    </div>
  );
}

function ResponseSection({
  title,
  fields,
  responses,
}: {
  title: string;
  fields: CheckinFieldConfig[];
  responses: CheckinResponses | null | undefined;
}) {
  const entries = fields
    .map((field) => ({ label: field.label, value: responses?.[field.key] }))
    .filter((entry) => entry.value);

  if (entries.length === 0) return null;

  return (
    <div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
      <p className="text-xs font-medium text-foreground/60">{title}</p>
      <dl className="mt-2 flex flex-col gap-2 text-sm">
        {entries.map((entry) => (
          <div key={entry.label}>
            <dt className="text-foreground/60">{entry.label}</dt>
            <dd>{entry.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
