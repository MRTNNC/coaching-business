import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

interface PendingCheckin {
  id: string;
  client_id: string;
  submitted_at: string;
  profiles: { full_name: string | null } | null;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ data: clients }, { data: pendingCheckins }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("full_name")
      .returns<Profile[]>(),
    supabase
      .from("checkins")
      .select("id, client_id, submitted_at, profiles(full_name)")
      .eq("status", "pending")
      .order("submitted_at", { ascending: false })
      .returns<PendingCheckin[]>(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <Link
            href="/admin/clients/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Invite client
          </Link>
        </div>
        <ul className="mt-6 flex flex-col gap-2">
          {(clients ?? []).map((client) => (
            <li key={client.id}>
              <Link
                href={`/admin/clients/${client.id}`}
                className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
              >
                <span>{client.full_name || client.email}</span>
                <span className="text-xs text-foreground/60">
                  {client.email}
                </span>
              </Link>
            </li>
          ))}
          {(!clients || clients.length === 0) && (
            <p className="text-sm text-foreground/60">No clients yet.</p>
          )}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-medium">Check-ins awaiting review</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {(pendingCheckins ?? []).map((checkin) => (
            <li key={checkin.id}>
              <Link
                href={`/admin/clients/${checkin.client_id}`}
                className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
              >
                <span>{checkin.profiles?.full_name ?? "Client"}</span>
                <span className="text-xs text-foreground/60">
                  {new Date(checkin.submitted_at).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
          {(!pendingCheckins || pendingCheckins.length === 0) && (
            <p className="text-sm text-foreground/60">All caught up.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
