"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CommentForm({ checkinId }: { checkinId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
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
      setError("Session expired.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("comments").insert({
      checkin_id: checkinId,
      admin_id: user.id,
      body,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    await supabase
      .from("checkins")
      .update({ status: "reviewed" })
      .eq("id", checkinId);

    setBody("");
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        placeholder="Leave feedback…"
        required
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm dark:border-white/20 dark:bg-transparent"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
      >
        {submitting ? "Posting…" : "Post & mark reviewed"}
      </button>
    </form>
  );
}
