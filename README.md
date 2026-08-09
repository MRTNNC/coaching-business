# Coaching Business Website

A Next.js site for a 1:1 coaching business: a public marketing site
(services, pricing, book-a-call), a client portal for weekly check-ins
(weight, progress photos, Q&A), and an admin portal for reviewing check-ins,
leaving feedback, and issuing workout/nutrition plans as downloadable PDFs.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase: Postgres, Auth, and Storage
- `@react-pdf/renderer` for on-demand plan PDFs
- Cal.com embed for booking calls
- Deployed on Vercel

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the **Project URL**, **anon public**
   key, and **service_role** key.
3. In the Supabase SQL editor, run the migration in
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   This creates all tables, row-level security policies, the
   `checkin-photos` storage bucket, and a few starter pricing packages.
4. **Auth → URL Configuration**: add your site URLs to the redirect allow
   list, e.g. `http://localhost:3000/**` and `https://your-app.vercel.app/**`.
5. **Auth → Email Templates → Invite user**: replace the confirmation link
   with one that routes through this app's own confirm handler, so invited
   clients land on the "set your password" page:

   ```html
   <h2>You've been invited to start coaching</h2>
   <p>
     <a
       href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next={{ .RedirectTo }}"
       >Accept the invite and set your password</a
     >
   </p>
   ```

6. **Auth → Providers**: disable public sign-ups if you want client accounts
   to be strictly admin-invited (Settings → Authentication → "Allow new
   users to sign up" off is optional; self-signup isn't exposed anywhere in
   the UI regardless).
7. Create your own admin account:
   - Sign up once through Supabase (e.g. via the Supabase dashboard's
     **Authentication → Users → Add user**, or by temporarily hitting the
     app's sign-up flow if you add one) using your own email.
   - In the SQL editor, promote it:
     ```sql
     update public.profiles set role = 'admin' where email = 'you@example.com';
     ```

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the Supabase values
plus:

- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` locally, your Vercel URL
  in production.
- `NEXT_PUBLIC_CAL_COM_LINK` — your Cal.com booking page, e.g.
  `https://cal.com/your-username/intro-call`.

## 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Walk-through:

1. Log in at `/login` with your admin account → lands on `/admin`.
2. **Invite client** → they receive an email, follow the link, set a
   password, and land on `/portal`.
3. As the client: submit a check-in (`/portal/checkin`) with weight, photos,
   and notes.
4. As admin: open the client from `/admin`, review the check-in, leave a
   comment (marks it reviewed), and create a plan (`New plan`).
5. As the client: download the plan PDF from `/portal/plans`.

## 4. Deploy

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the same environment variables from `.env.local` in the Vercel
   project's **Settings → Environment Variables**.
4. Update `NEXT_PUBLIC_SITE_URL` to your Vercel URL, and add
   `https://your-app.vercel.app/**` to Supabase's Auth redirect allow list.
5. Deploy.

## Project structure

- `src/app/(marketing)` — public site: home, pricing, booking, login.
- `src/app/portal` — client portal (check-ins, history, plans).
- `src/app/admin` — admin portal (clients, check-in review, plan editor).
- `src/app/api/plans/[id]/pdf` — renders a plan to PDF on demand.
- `src/app/api/admin/invite-client` — server-side client invite (uses the
  Supabase service-role key).
- `src/lib/supabase` — browser/server/admin Supabase client helpers.
- `src/proxy.ts` — route protection for `/portal` and `/admin`.
- `supabase/migrations` — database schema and RLS policies.

## Notes on payments

Pricing is informational only for now (`packages` table, editable directly
in Supabase). Each package has an unused `stripe_price_id` column — adding
paid checkout later means populating that column and adding a Stripe
checkout route, without changing the pricing data model.
