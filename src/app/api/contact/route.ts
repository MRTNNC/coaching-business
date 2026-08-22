import { Resend } from "resend";
import { NextResponse } from "next/server";

const CONTACT_EMAIL = "m.cull@arzuno.co.uk";

export async function POST(request: Request) {
  const { service, email, message, honeypot } = await request.json();

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (
    !service ||
    typeof service !== "string" ||
    !email ||
    typeof email !== "string" ||
    !email.includes("@") ||
    !message ||
    typeof message !== "string"
  ) {
    return NextResponse.json(
      { error: "Please fill in your email and details." },
      { status: 400 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress =
    process.env.RESEND_FROM_EMAIL ?? "Arzuno Fitness <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `Enquiry: ${service}`,
    text: `Service: ${service}\nFrom: ${email}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
