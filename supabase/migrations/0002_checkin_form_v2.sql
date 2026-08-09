-- Expand the check-in form: a daily weight/steps/hydration table, body
-- measurements, and a full set of weekly training/nutrition/lifestyle
-- questions, replacing the original fixed weight + three ratings.
--
-- Existing RLS policies on checkins are unaffected (they key off client_id,
-- not these columns).

alter table public.checkins
  drop column weight,
  drop column energy_rating,
  drop column sleep_rating,
  drop column adherence_rating,
  drop column notes,
  add column week_start date,
  add column waist_cm numeric,
  add column blood_pressure text,
  add column blood_glucose text,
  add column daily_log jsonb not null default '[]'::jsonb,
  add column responses jsonb not null default '{}'::jsonb;
