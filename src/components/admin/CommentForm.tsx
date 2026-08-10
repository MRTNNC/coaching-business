"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type RecordingState = "idle" | "recording" | "recorded";

function extensionForMimeType(mimeType: string): string {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  return "webm";
}

export function CommentForm({ checkinId }: { checkinId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordError, setRecordError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (recordingState !== "recording") return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [recordingState]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function startRecording() {
    setRecordError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecordingState("recorded");
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setElapsedSeconds(0);
      setRecordingState("recording");
    } catch {
      setRecordError(
        "Couldn't access your microphone. Check your browser's mic permissions.",
      );
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function discardRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingState("idle");
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
      setError("Session expired.");
      setSubmitting(false);
      return;
    }

    const { data: comment, error: insertError } = await supabase
      .from("comments")
      .insert({
        checkin_id: checkinId,
        admin_id: user.id,
        body,
      })
      .select()
      .single();

    if (insertError || !comment) {
      setError(insertError?.message ?? "Could not post feedback.");
      setSubmitting(false);
      return;
    }

    if (audioBlob) {
      const ext = extensionForMimeType(audioBlob.type);
      const path = `${checkinId}/${comment.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("voice-notes")
        .upload(path, audioBlob, { contentType: audioBlob.type });

      if (uploadError) {
        setError(`Voice note upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      await supabase
        .from("comments")
        .update({ voice_note_path: path })
        .eq("id", comment.id);
    }

    await supabase
      .from("checkins")
      .update({ status: "reviewed" })
      .eq("id", checkinId);

    setBody("");
    discardRecording();
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

      <div className="flex items-center gap-3">
        {recordingState === "idle" && (
          <button
            type="button"
            onClick={startRecording}
            className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Record voice note
          </button>
        )}

        {recordingState === "recording" && (
          <button
            type="button"
            onClick={stopRecording}
            className="rounded-full border border-red-500 px-3 py-1.5 text-xs font-medium text-red-600"
          >
            Stop recording ({elapsedSeconds}s)
          </button>
        )}

        {recordingState === "recorded" && audioUrl && (
          <div className="flex items-center gap-2">
            <audio src={audioUrl} controls className="h-8" />
            <button
              type="button"
              onClick={discardRecording}
              className="text-xs text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {recordError && <p className="text-xs text-red-600">{recordError}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting || recordingState === "recording"}
        className="self-start rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
      >
        {submitting ? "Posting…" : "Post & mark reviewed"}
      </button>
    </form>
  );
}
