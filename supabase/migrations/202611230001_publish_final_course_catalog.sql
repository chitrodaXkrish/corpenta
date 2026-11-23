-- Publish the seven course names, durations, and INR prices confirmed by the academy.
-- Keep descriptions factual until detailed curricula are supplied.
update public.courses
set slug = catalog.slug,
    title = catalog.title,
    short_description = catalog.duration_label || ' financial education course. Curriculum details will be shared by the academy.',
    full_description = catalog.duration_label || ' financial education course. Detailed curriculum and learning outcomes will be published by the academy.',
    duration_label = catalog.duration_label,
    price = catalog.price,
    currency = 'INR',
    sort_order = catalog.sort_order,
    is_published = true,
    archived_at = null,
    updated_at = now()
from (values
  ('00000000-0000-4000-8000-000000000001'::uuid, 'money-code', 'MONEY CODE', '2 weeks', 999::numeric, 1),
  ('00000000-0000-4000-8000-000000000002'::uuid, 'money-mindset', 'MONEY MINDSET', '2 weeks', 4999::numeric, 2),
  ('00000000-0000-4000-8000-000000000003'::uuid, 'capital-shield', 'CAPITAL SHIELD', '2 weeks', 7999::numeric, 3),
  ('00000000-0000-4000-8000-000000000004'::uuid, 'corpenta-wealth-architect', 'CORPENTA WEALTH ARCHITECT', '10 weeks', 24999::numeric, 4),
  ('00000000-0000-4000-8000-000000000005'::uuid, 'nism-certify', 'NISM CERTIFY', '4 weeks', 19999::numeric, 5),
  ('00000000-0000-4000-8000-000000000006'::uuid, 'corpenta-funded', 'CORPENTA FUNDED', '8 weeks', 34999::numeric, 6)
) as catalog(id, slug, title, duration_label, price, sort_order)
where public.courses.id = catalog.id
  and public.courses.title = 'Course title to be confirmed';

insert into public.courses(
  id, slug, title, short_description, full_description, duration_label,
  price, currency, sort_order, is_published
)
values (
  '00000000-0000-4000-8000-000000000007', 'crypto-code', 'CRYPTO CODE',
  '4 weeks financial education course. Curriculum details will be shared by the academy.',
  '4 weeks financial education course. Detailed curriculum and learning outcomes will be published by the academy.',
  '4 weeks', 9999, 'INR', 7, true
)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  duration_label = excluded.duration_label,
  price = excluded.price,
  currency = excluded.currency,
  sort_order = excluded.sort_order,
  is_published = true,
  archived_at = null,
  updated_at = now();
