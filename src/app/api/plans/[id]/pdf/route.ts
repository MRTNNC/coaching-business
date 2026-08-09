import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PlanDocument } from "@/lib/pdf/PlanDocument";
import type { Plan, Profile } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS on `plans` already restricts this to the plan's own client or an
  // admin, so a plain select doubles as the authorization check.
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("id", id)
    .single<Plan>();

  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: client } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", plan.client_id)
    .single<Pick<Profile, "full_name">>();

  const buffer = await renderToBuffer(
    createElement(PlanDocument, {
      plan,
      clientName: client?.full_name ?? "Client",
    }) as Parameters<typeof renderToBuffer>[0],
  );

  const filename = `${plan.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
