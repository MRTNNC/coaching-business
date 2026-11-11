-- Group the pricing page into sections (coaching packages, plans only,
-- contest prep, one-off sessions) and replace the price list.

alter table public.packages
  add column category text;

delete from public.packages;

insert into public.packages (name, description, price, billing_period, monthly_equivalent, sort_order, is_addon, category)
values
  (
    'Lifestyle Monthly',
    'Ongoing coaching built around a busy life. Training and nutrition that flexes with your schedule, weekly check-ins, and no fixed commitment.',
    150,
    'month',
    null,
    1,
    false,
    'coaching'
  ),
  (
    'Lifestyle 6 Month Block',
    'Six months of Lifestyle coaching with a one-off payment, saving £250 compared with paying monthly.',
    650,
    '6 months',
    108,
    2,
    false,
    'coaching'
  ),
  ('Training Plan Only', null, 65, null, null, 1, true, 'plans'),
  ('Nutrition Plan Only', null, 100, null, null, 2, true, 'plans'),
  ('Training + Nutrition Plan', null, 140, null, null, 3, true, 'plans'),
  ('Peak Week Only', null, 180, null, null, 1, true, 'contest_prep'),
  ('4-Week Rush Prep', null, 250, null, null, 2, true, 'contest_prep'),
  ('1:1 Workout in Nottingham', null, 75, null, null, 1, true, 'one_off'),
  ('30 Minute Nutrition and Training Call', null, 35, null, null, 2, true, 'one_off'),
  ('1 Hour Nutrition and Training Call', null, 45, null, null, 3, true, 'one_off');
