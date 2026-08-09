import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Checkin, Plan } from "@/lib/types";

export default async function PortalDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: latestCheckin }, { data: plans }] = await Promise.all([
    supabase
      .from("checkins")
      .select("*")
      .eq("client_id", user!.id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle<Checkin>(),
    supabase
      .from("plans")
      .select("*")
      .eq("client_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<Plan[]>(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-foreground/70">
          {latestCheckin
            ? `Last check-in submitted ${new Date(
                latestCheckin.submitted_at,
              ).toLocaleDateString()} — ${
                latestCheckin.status === "reviewed"
                  ? "reviewed by your coach."
                  : "awaiting review."
              }`
            : "You haven't submitted a check-in yet."}
        </p>
        <Link
          href="/portal/checkin"
          className="mt-4 inline-block rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
        >
          Submit a check-in
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-medium">Recent plans</h2>
        {plans && plans.length > 0 ? (
          <ul className="mt-4 flex flex-col gap-3">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 dark:border-white/15"
              >
                <div>
                  <p className="font-medium">{plan.title}</p>
                  <p className="text-xs capitalize text-foreground/60">
                    {plan.plan_type} · v{plan.version}
                  </p>
                </div>
                <a
                  href={`/api/plans/${plan.id}/pdf`}
                  className="text-sm font-medium underline underline-offset-2"
                >
                  Download PDF
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-foreground/60">No plans yet.</p>
        )}
      </div>
    </div>
  );
}
