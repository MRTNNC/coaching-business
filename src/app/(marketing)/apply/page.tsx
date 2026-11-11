import type { Metadata } from "next";
import { ApplicationForm } from "@/components/marketing/ApplicationForm";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";

export const metadata: Metadata = {
  title: "Coaching Application",
  description:
    "Apply for 1:1 coaching with Arzuno Coaching. Tell me about your goals, training, nutrition and lifestyle so we can work out where your plan should start.",
  alternates: {
    canonical: "/apply",
  },
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("is_addon", false)
    .order("sort_order")
    .returns<Package[]>();

  const packageOptions = (packages ?? []).map((pkg) => pkg.name);
  const requested = (await searchParams).package;
  const initialPackage =
    typeof requested === "string" && packageOptions.includes(requested)
      ? requested
      : "";

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Coaching application
      </h1>
      <p className="mt-4 text-foreground/70">
        Thanks for your interest in coaching. This form takes about 10 to 15
        minutes and helps me work out whether we&apos;re a good fit and where
        your plan should start. Answer as honestly as you can; there are no
        wrong answers, and &ldquo;not sure&rdquo; is fine.
      </p>
      <p className="mt-3 text-foreground/70">
        Everything you share is kept confidential and used only to plan your
        coaching.
      </p>

      <ApplicationForm
        packageOptions={packageOptions}
        initialPackage={initialPackage}
      />
    </section>
  );
}
