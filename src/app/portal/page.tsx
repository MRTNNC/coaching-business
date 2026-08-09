import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WeightChart, type WeightPoint } from "@/components/portal/WeightChart";
import { CHECKIN_DAYS, type Checkin, type Plan } from "@/lib/types";

const DAY_OFFSET: Record<string, number> = Object.fromEntries(
  CHECKIN_DAYS.map((day, index) => [day, index]),
);

function buildWeightPoints(
  checkins: Pick<Checkin, "week_start" | "submitted_at" | "daily_log">[],
): WeightPoint[] {
  return checkins.flatMap((checkin) => {
    const base = checkin.week_start ? new Date(checkin.week_start) : null;

    return (checkin.daily_log ?? [])
      .filter((entry) => entry.weight && !Number.isNaN(Number(entry.weight)))
      .map((entry) => {
        let label = entry.day.slice(0, 3);
        if (base) {
          const date = new Date(base);
          date.setDate(date.getDate() + (DAY_OFFSET[entry.day] ?? 0));
          label = date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
        }
        return { label, weight: Number(entry.weight) };
      });
  });
}

export default async function PortalDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: latestCheckin }, { data: plans }, { data: weightCheckins }] =
    await Promise.all([
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
      supabase
        .from("checkins")
        .select("week_start, submitted_at, daily_log")
        .eq("client_id", user!.id)
        .order("submitted_at", { ascending: true })
        .returns<
          Pick<Checkin, "week_start" | "submitted_at" | "daily_log">[]
        >(),
    ]);

  const weightPoints = buildWeightPoints(weightCheckins ?? []);

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
        <h2 className="text-lg font-medium">Weight progress</h2>
        <div className="mt-4 rounded-2xl border border-black/10 p-6 dark:border-white/15">
          <WeightChart data={weightPoints} />
        </div>
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
