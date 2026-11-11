# Arzuno Coaching Website

A Next.js site for a 1:1 coaching business: home, about, pricing (packages
read live from Supabase), a coaching application form, booking (Cal.com
embed), a shop linking to Payhip, FAQ, contact and privacy pages.
Application and enquiry forms are emailed to the coach via Resend.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase Postgres for the pricing `packages` table
- Resend for application and enquiry emails
- Cal.com embed for booking calls
- Deployed on Vercel

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the **Project URL** and **anon
   public** key.
3. In the Supabase SQL editor, run the migrations in
   [`supabase/migrations`](supabase/migrations) in order. Earlier
   migrations also create tables for a client portal that has since been
   removed; only `packages` is used now.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values.

## 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Deploy

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the same environment variables from `.env.local` in the Vercel
   project's **Settings → Environment Variables**.
4. Deploy.

## Project structure

- `src/app/(marketing)` - the public site pages.
- `src/app/api/apply` - emails coaching applications to the coach.
- `src/app/api/contact` - emails service enquiries to the coach.
- `src/lib/applicationFields.ts` - the application form's questions.
- `src/lib/supabase/server.ts` - Supabase client for reading packages.
- `supabase/migrations` - database schema.

## Editing prices

Pricing lives in the `packages` table and can be edited directly in
Supabase. `category` groups the pricing page sections (`coaching`,
`plans`, `contest_prep`, `one_off`) and `is_addon` separates the package
cards from the lists.
