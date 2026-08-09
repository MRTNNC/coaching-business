import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/lib/types";

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("client_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<Plan[]>();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Your plans</h1>
      <div className="mt-8 flex flex-col gap-4">
        {(plans ?? []).map((plan) => (
          <div
            key={plan.id}
            className="flex items-center justify-between rounded-2xl border border-black/10 p-6 dark:border-white/15"
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
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Download PDF
            </a>
          </div>
        ))}
        {(!plans || plans.length === 0) && (
          <p className="text-sm text-foreground/60">
            No plans yet — your coach will send one after your first check-in
            review.
          </p>
        )}
      </div>
    </div>
  );
}
