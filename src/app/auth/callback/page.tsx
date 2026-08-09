"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Supabase's default invite/magic-link emails redirect here with the
// session in the URL hash (`#access_token=...&refresh_token=...`) rather
// than a query param, since editing the email template's raw HTML to use
// the token_hash flow requires custom SMTP. This page picks the tokens out
// of the hash client-side (the server never sees a hash fragment) and
// turns them into a real session.
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handle() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        setError("This invite link is invalid or has expired.");
        return;
      }

      const supabase = createClient();
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      router.replace("/portal/set-password");
    }

    handle();
  }, [router]);

  return (
    <div className="mx-auto max-w-sm px-6 py-20 text-center">
      {error ? (
        <>
          <p className="text-sm text-red-600">{error}</p>
          <p className="mt-2 text-sm text-foreground/60">
            Ask your coach to send a new invite.
          </p>
        </>
      ) : (
        <p className="text-sm text-foreground/60">
          Setting up your account…
        </p>
      )}
    </div>
  );
}
