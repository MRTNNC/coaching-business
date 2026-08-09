import { InviteClientForm } from "@/components/admin/InviteClientForm";

export default function NewClientPage() {
  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight">
        Invite a client
      </h1>
      <p className="mt-2 text-foreground/70">
        They&apos;ll get an email to set their password and log in.
      </p>
      <div className="mt-8">
        <InviteClientForm />
      </div>
    </div>
  );
}
