import { CheckinDetail } from "@/components/CheckinDetail";
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
          />
        ))}

        {(!checkins || checkins.length === 0) && (
          <p className="text-sm text-foreground/60">
            No check-ins submitted yet.
          </p>
        )}
      </div>
    </div>
  );
}
