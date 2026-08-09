-- Replace the placeholder seed packages with real pricing, and distinguish
-- recurring coaching packages from one-off add-on services.

alter table public.packages
  add column is_addon boolean not null default false;

delete from public.packages;

insert into public.packages (name, description, price, billing_period, sort_order, is_addon)
values
  (
    'Monthly Rolling',
    'Training plan, nutrition guidance, plan adjustments, and weekly check-ins. No commitment.',
    130,
    'month',
    1,
    false
  ),
  (
    '16 Week Prep',
    'A 16-week commitment. Includes everything in the Monthly Rolling tier, plus twice-daily check-ins during peak week. Works out to £110/month.',
    440,
    '16 weeks',
    2,
    false
  ),
  (
    'Fitness and Lifestyle',
    'Everything in the Monthly Rolling tier, plus consultation on fitting fitness around working life, advice around finances, and a quarterly video call to reset goals and keep you on track.',
    200,
    'month',
    3,
    false
  ),
  (
    'Complete Fitness, Lifestyle and Health',
    'Everything in the Fitness and Lifestyle tier, plus a quarterly review of your bloodwork by a doctor and a separate consult call to discuss how to improve any markers needed.',
    400,
    'month',
    4,
    false
  ),
  (
    '1:1 Workout in Nottingham',
    null,
    70,
    null,
    1,
    true
  ),
  (
    'One-off 30 Minute Nutrition and Training Call',
    null,
    35,
    null,
    2,
    true
  ),
  (
    'One-off 1 Hour Nutrition and Training Call',
    null,
    45,
    null,
    3,
    true
  ),
  (
    'One-off Consultation on Lifestyle and Finance',
    null,
    55,
    null,
    4,
    true
  );
