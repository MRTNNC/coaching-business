-- Simplify to 3 recurring packages with descriptive blurbs, track a
-- monthly-equivalent price for packages billed over a longer period, and
-- refresh the one-off services list.

alter table public.packages
  add column monthly_equivalent numeric;

delete from public.packages where is_addon = false;

insert into public.packages (name, description, price, billing_period, monthly_equivalent, sort_order, is_addon)
values
  (
    'Lifestyle Monthly',
    'Ongoing coaching built around a busy life. Training and nutrition that flexes with your schedule, weekly check-ins, and no fixed commitment.',
    120,
    'month',
    null,
    1,
    false
  ),
  (
    'Prep Monthly',
    'Structured coaching for clients actively working toward a show, paid month to month. Daily check-ins during peak week without locking into a fixed block.',
    140,
    'month',
    null,
    2,
    false
  ),
  (
    '16 Week Prep',
    'A focused 16-week transformation block: structured training and nutrition, weekly check-ins throughout, and twice-daily check-ins during peak week to nail your result. 16 week commitment with a one-off payment.',
    400,
    '16 weeks',
    100,
    3,
    false
  );

delete from public.packages where is_addon = true;

insert into public.packages (name, description, price, billing_period, monthly_equivalent, sort_order, is_addon)
values
  ('1:1 Workout in Nottingham', null, 75, null, null, 1, true),
  ('One-off 30 Minute Nutrition and Training Call', null, 35, null, null, 2, true),
  ('One-off 1 Hour Nutrition and Training Call', null, 45, null, null, 3, true),
  ('One-off Bloodwork Consultation with Martin', null, 60, null, null, 4, true),
  ('One-off Bloodwork Consultation with a Practising Doctor', null, 120, null, null, 5, true);
