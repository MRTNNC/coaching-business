import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommentForm } from "@/components/admin/CommentForm";
import { CheckinDetail } from "@/components/CheckinDetail";
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

  const signedVoiceNoteUrls = new Map<string, string>();
  for (const comment of comments ?? []) {
    if (!comment.voice_note_path) continue;
    const { data } = await supabase.storage
      .from("voice-notes")
      .createSignedUrl(comment.voice_note_path, 60 * 5);
    if (data?.signedUrl) signedVoiceNoteUrls.set(comment.id, data.signedUrl);
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
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:opacity-90"
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
          {(checkins ?? []).map((checkin) => (
            <CheckinDetail
              key={checkin.id}
              checkin={checkin}
              photos={(photos ?? []).filter(
                (p) => p.checkin_id === checkin.id,
              )}
              photoUrls={signedPhotoUrls}
              comments={(comments ?? []).filter(
                (c) => c.checkin_id === checkin.id,
              )}
              voiceNoteUrls={signedVoiceNoteUrls}
              footer={<CommentForm checkinId={checkin.id} />}
            />
          ))}

          {(!checkins || checkins.length === 0) && (
            <p className="text-sm text-foreground/60">No check-ins yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
