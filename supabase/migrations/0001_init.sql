-- Coaching business schema: profiles, check-ins, comments, plans, packages.
-- Run this in the Supabase SQL editor (or via `supabase db push`).

-- ── profiles ────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'client' check (role in ('admin', 'client')),
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Security-definer helper so RLS policies can check "is this user an admin"
-- without recursively re-triggering RLS on profiles itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create a profile row whenever a new auth user is created (self-signup
-- is disabled in this app, but admin-invited users also flow through here).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'client'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

create policy "profiles_admin_insert"
  on public.profiles for insert
  with check (public.is_admin());

-- ── checkins ────────────────────────────────────────────────────────────
create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  submitted_at timestamptz not null default now(),
  weight numeric,
  energy_rating smallint check (energy_rating between 1 and 5),
  sleep_rating smallint check (sleep_rating between 1 and 5),
  adherence_rating smallint check (adherence_rating between 1 and 5),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewed'))
);

alter table public.checkins enable row level security;

create policy "checkins_select_own_or_admin"
  on public.checkins for select
  using (client_id = auth.uid() or public.is_admin());

create policy "checkins_insert_own"
  on public.checkins for insert
  with check (client_id = auth.uid());

create policy "checkins_update_admin"
  on public.checkins for update
  using (public.is_admin());

-- ── checkin photos ──────────────────────────────────────────────────────
create table public.checkin_photos (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  storage_path text not null,
  angle text not null check (angle in ('front', 'side', 'back'))
);

alter table public.checkin_photos enable row level security;

create policy "checkin_photos_select_own_or_admin"
  on public.checkin_photos for select
  using (
    exists (
      select 1 from public.checkins c
      where c.id = checkin_photos.checkin_id
        and (c.client_id = auth.uid() or public.is_admin())
    )
  );

create policy "checkin_photos_insert_own"
  on public.checkin_photos for insert
  with check (
    exists (
      select 1 from public.checkins c
      where c.id = checkin_photos.checkin_id
        and c.client_id = auth.uid()
    )
  );

-- ── comments (admin feedback on a check-in) ────────────────────────────
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  admin_id uuid not null references public.profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "comments_select_own_or_admin"
  on public.comments for select
  using (
    exists (
      select 1 from public.checkins c
      where c.id = comments.checkin_id
        and (c.client_id = auth.uid() or public.is_admin())
    )
  );

create policy "comments_insert_admin"
  on public.comments for insert
  with check (public.is_admin() and admin_id = auth.uid());

-- ── plans (workout / nutrition, delivered as downloadable PDFs) ───────
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  plan_type text not null check (plan_type in ('workout', 'nutrition')),
  title text not null,
  content jsonb not null default '{"sections": []}'::jsonb,
  version int not null default 1,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table public.plans enable row level security;

create policy "plans_select_own_or_admin"
  on public.plans for select
  using (client_id = auth.uid() or public.is_admin());

create policy "plans_admin_write"
  on public.plans for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── packages (pricing page) ────────────────────────────────────────────
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  billing_period text,
  stripe_price_id text,
  sort_order int not null default 0
);

alter table public.packages enable row level security;

create policy "packages_select_public"
  on public.packages for select
  using (true);

create policy "packages_admin_write"
  on public.packages for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── storage: private bucket for check-in progress photos ──────────────
insert into storage.buckets (id, name, public)
values ('checkin-photos', 'checkin-photos', false)
on conflict (id) do nothing;

-- Photos are uploaded to paths like "{client_id}/{checkin_id}/{angle}.jpg"
create policy "checkin_photos_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'checkin-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "checkin_photos_storage_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'checkin-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- ── seed: starter pricing packages (edit freely from Supabase later) ──
insert into public.packages (name, description, price, billing_period, sort_order)
values
  ('Foundations', '4 weeks of coaching to build the basics: training plan, nutrition guidance, weekly check-ins.', 150, 'month', 1),
  ('Transformation', 'Full 12-week programme with weekly check-ins, plan adjustments, and direct messaging support.', 250, 'month', 2),
  ('1:1 Elite', 'Highest-touch coaching: twice-weekly check-ins, priority support, and quarterly strategy calls.', 400, 'month', 3);
