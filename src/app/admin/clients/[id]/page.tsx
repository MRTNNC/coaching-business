import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommentForm } from "@/components/admin/CommentForm";
import type {
  Checkin,
  CheckinPhoto,
  Comment,
  Plan,
  Profile,
} from "@/lib/types";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single<Profile>();

  if (!client) notFound();

  const [{ data: checkins }, { data: plans }] = await Promise.all([
    supabase
      .from("checkins")
      .select("*")
      .eq("client_id", id)
      .order("submitted_at", { ascending: false })
      .returns<Checkin[]>(),
    supabase
      .from("plans")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false })
      .returns<Plan[]>(),
  ]);

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
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {client.full_name || client.email}
          </h1>
          <p className="text-sm text-foreground/60">{client.email}</p>
        </div>
        <Link
          href={`/admin/clients/${id}/plans/new`}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
        >
          New plan
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-medium">Plans</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {(plans ?? []).map((plan) => (
            <li
              key={plan.id}
              className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 dark:border-white/15"
            >
              <div>
                <p className="font-medium">{plan.title}</p>
                <p className="text-xs capitalize text-foreground/60">
                  {plan.plan_type} · v{plan.version} ·{" "}
                  {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
              <a
                href={`/api/plans/${plan.id}/pdf`}
                className="text-sm font-medium underline underline-offset-2"
              >
                Download
              </a>
            </li>
          ))}
          {(!plans || plans.length === 0) && (
            <p className="text-sm text-foreground/60">No plans yet.</p>
          )}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-medium">Check-ins</h2>
        <div className="mt-4 flex flex-col gap-6">
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
                      Feedback
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

                <CommentForm checkinId={checkin.id} />
              </div>
            );
          })}

          {(!checkins || checkins.length === 0) && (
            <p className="text-sm text-foreground/60">No check-ins yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
