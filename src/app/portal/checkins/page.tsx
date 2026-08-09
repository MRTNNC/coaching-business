import { createClient } from "@/lib/supabase/server";
import type { Checkin, CheckinPhoto, Comment } from "@/lib/types";

export default async function CheckinsHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: checkins } = await supabase
    .from("checkins")
    .select("*")
    .eq("client_id", user!.id)
    .order("submitted_at", { ascending: false })
    .returns<Checkin[]>();

  const checkinIds = (checkins ?? []).map((c) => c.id);

  const [{ data: photos }, { data: comments }] = await Promise.all([
    checkinIds.length
      ? supabase
          .from("checkin_photos")
          .select("*")
          .in("checkin_id", checkinIds)
          .returns<CheckinPhoto[]>()
      : Promise.resolve({ data: [] as CheckinPhoto[] }),
    checkinIds.length
      ? supabase
          .from("comments")
          .select("*")
          .in("checkin_id", checkinIds)
          .order("created_at")
          .returns<Comment[]>()
      : Promise.resolve({ data: [] as Comment[] }),
  ]);

  const signedPhotoUrls = new Map<string, string>();
  for (const photo of photos ?? []) {
    const { data } = await supabase.storage
      .from("checkin-photos")
      .createSignedUrl(photo.storage_path, 60 * 5);
    if (data?.signedUrl) signedPhotoUrls.set(photo.id, data.signedUrl);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Check-in history
      </h1>

      <div className="mt-8 flex flex-col gap-6">
        {(checkins ?? []).map((checkin) => {
          const checkinPhotos = (photos ?? []).filter(
            (p) => p.checkin_id === checkin.id,
          );
          const checkinComments = (comments ?? []).filter(
            (c) => c.checkin_id === checkin.id,
          );

          return (
            <div
              key={checkin.id}
              className="rounded-2xl border border-black/10 p-6 dark:border-white/15"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {new Date(checkin.submitted_at).toLocaleDateString()}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    checkin.status === "reviewed"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  }`}
                >
                  {checkin.status === "reviewed"
                    ? "Reviewed"
                    : "Awaiting review"}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-foreground/60">Weight</dt>
                  <dd>{checkin.weight ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-foreground/60">Energy</dt>
                  <dd>{checkin.energy_rating ?? "—"}/5</dd>
                </div>
                <div>
                  <dt className="text-foreground/60">Sleep</dt>
                  <dd>{checkin.sleep_rating ?? "—"}/5</dd>
                </div>
                <div>
                  <dt className="text-foreground/60">Adherence</dt>
                  <dd>{checkin.adherence_rating ?? "—"}/5</dd>
                </div>
              </dl>

              {checkin.notes && (
                <p className="mt-4 text-sm text-foreground/80">
                  {checkin.notes}
                </p>
              )}

              {checkinPhotos.length > 0 && (
                <div className="mt-4 flex gap-3">
                  {checkinPhotos.map((photo) => {
                    const url = signedPhotoUrls.get(photo.id);
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

              {checkinComments.length > 0 && (
                <div className="mt-4 border-t border-black/10 pt-4 dark:border-white/10">
                  <p className="text-xs font-medium text-foreground/60">
                    Coach feedback
                  </p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {checkinComments.map((comment) => (
                      <li key={comment.id} className="text-sm">
                        {comment.body}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {(!checkins || checkins.length === 0) && (
          <p className="text-sm text-foreground/60">
            No check-ins submitted yet.
          </p>
        )}
      </div>
    </div>
  );
}
