import { CheckinForm } from "@/components/portal/CheckinForm";

export default function NewCheckinPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New check-in</h1>
      <p className="mt-2 text-foreground/70">
        Fill this in weekly so your coach can track progress and adjust your
        plan.
      </p>
      <div className="mt-8 max-w-xl">
        <CheckinForm />
      </div>
    </div>
  );
}
