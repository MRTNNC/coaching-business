import "server-only";
import { createClient } from "@supabase/supabase-js";

// Uses the service-role key, which bypasses RLS entirely. Only ever import
// this from server-only code paths (route handlers, server actions) that
// have already verified the caller is an admin.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
