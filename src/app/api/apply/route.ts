import { Resend } from "resend";
import { NextResponse } from "next/server";
import {
  APPLICATION_DECLARATIONS,
  APPLICATION_SECTIONS,
} from "@/lib/applicationFields";

const CONTACT_EMAIL = "m.cull@arzuno.co.uk";

export async function POST(request: Request) {
  const { answers, declarations, signature, honeypot } = await request.json();

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const value = (key: string): string => {
    const raw = answers?.[key];
    return typeof raw === "string" ? raw.trim() : "";
  };

  const missingField = APPLICATION_SECTIONS.flatMap((s) => s.fields).some(
    (field) => field.required && !value(field.key),
  );
  const missingDeclaration = APPLICATION_DECLARATIONS.some(
    (d) => d.required && declarations?.[d.key] !== true,
  );

  if (
    missingField ||
    missingDeclaration ||
    !value("email").includes("@") ||
    typeof signature !== "string" ||
    !signature.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Please fill in the required questions, tick the declarations, and type your name to sign.",
      },
      { status: 400 },
    );
  }

  const healthFlags = APPLICATION_SECTIONS.flatMap((s) => s.fields)
    .filter((field) => field.type === "yesno" && value(field.key) === "Yes")
    .map((field) => field.label);

  const lines: string[] = [];

  if (healthFlags.length > 0) {
    lines.push(
      `HEALTH: answered "Yes" to ${healthFlags.length} question(s), check section 5 and ask for GP clearance if needed.`,
      "",
    );
  }

  for (const section of APPLICATION_SECTIONS) {
    lines.push(section.title.toUpperCase());
    for (const field of section.fields) {
      let answer = value(field.key) || "-";
      if (field.type === "yesno" && answer === "Yes") {
        const details = value(`${field.key}_details`);
        if (details) answer = `Yes: ${details}`;
      }
      lines.push(`${field.label}\n  ${answer.replace(/\n/g, "\n  ")}`);
    }
    lines.push("");
  }

  lines.push("7. DECLARATION AND CONSENT");
  for (const declaration of APPLICATION_DECLARATIONS) {
    lines.push(
      `[${declarations?.[declaration.key] === true ? "x" : " "}] ${declaration.label}`,
    );
  }
  lines.push(
    "",
    `Signed: ${signature.trim()}`,
    `Date: ${new Date().toLocaleDateString("en-GB", { timeZone: "Europe/London" })}`,
  );

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress =
    process.env.RESEND_FROM_EMAIL ?? "Arzuno Coaching <onboarding@resend.dev>";

  const packageName = value("package");
  const { error } = await resend.emails.send({
    from: fromAddress,
    to: CONTACT_EMAIL,
    replyTo: value("email"),
    subject: `Coaching application: ${value("name")}${
      packageName ? ` (${packageName})` : ""
    }${healthFlags.length > 0 ? " [health flags]" : ""}`,
    text: lines.join("\n"),
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not send your application. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
