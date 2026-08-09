import { PlanForm } from "@/components/admin/PlanForm";

export default async function NewPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">New plan</h1>
      <p className="mt-2 text-foreground/70">
        This will be downloadable as a PDF from the client&apos;s portal.
      </p>
      <div className="mt-8">
        <PlanForm clientId={id} />
      </div>
    </div>
  );
}
