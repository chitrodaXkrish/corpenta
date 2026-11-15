create extension if not exists pgcrypto;

create type public.app_role as enum ('admin','student');
create type public.enrollment_status as enum ('pending','active','suspended','revoked');
create type public.payment_status as enum ('pending','succeeded','failed','refunded');
create type public.scenario_visibility as enum ('public','students','both','private');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, phone text, is_disabled boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'student', created_at timestamptz not null default now(),
  primary key(user_id,role)
);
create table public.batches (
  id uuid primary key default gen_random_uuid(), name text not null, description text,
  starts_on date, ends_on date, is_active boolean not null default true, created_at timestamptz not null default now()
);
create table public.courses (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  short_description text not null default '', full_description text not null default '', thumbnail_path text,
  price numeric(12,2), currency char(3) not null default 'INR', duration_label text,
  outcomes jsonb not null default '[]', mentor_id uuid, sort_order int not null default 0,
  is_published boolean not null default false, archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(price is null or price >= 0)
);
create table public.mentor_profiles (
  id uuid primary key default gen_random_uuid(), name text not null, title text, biography text,
  photo_path text, credentials text, is_published boolean not null default false,
  sort_order int not null default 0, created_at timestamptz not null default now()
);
alter table public.courses add constraint courses_mentor_fk foreign key(mentor_id) references public.mentor_profiles(id) on delete set null;
create table public.course_modules (
  id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id) on delete cascade,
  title text not null, description text, sort_order int not null default 0, is_published boolean not null default false,
  created_at timestamptz not null default now(), unique(course_id,sort_order)
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(), module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null, description text, video_provider text, video_asset_id text, duration_seconds int,
  sort_order int not null default 0, is_published boolean not null default false,
  created_at timestamptz not null default now(), unique(module_id,sort_order), check(duration_seconds is null or duration_seconds >= 0)
);
create table public.enrollments (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict, batch_id uuid references public.batches(id) on delete set null,
  payment_id uuid, status public.enrollment_status not null default 'pending', activated_at timestamptz,
  expires_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(student_id,course_id)
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references auth.users(id) on delete restrict,
  course_id uuid not null references public.courses(id) on delete restrict, provider text not null,
  provider_order_id text, provider_payment_id text unique, amount numeric(12,2) not null, currency char(3) not null,
  status public.payment_status not null default 'pending', verified_at timestamptz, failure_reason text,
  webhook_event_id text unique, audit jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(amount >= 0)
);
alter table public.enrollments add constraint enrollment_payment_fk foreign key(payment_id) references public.payments(id) on delete set null;
create table public.invoices (
  id uuid primary key default gen_random_uuid(), payment_id uuid not null unique references public.payments(id) on delete restrict,
  invoice_number text not null unique, storage_path text, issued_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table public.student_sessions (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references auth.users(id) on delete cascade,
  session_hash text not null unique, created_at timestamptz not null default now(), last_seen_at timestamptz not null default now(),
  revoked_at timestamptz, user_agent text
);
create table public.live_classes (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  course_id uuid references public.courses(id) on delete cascade, batch_id uuid references public.batches(id) on delete cascade,
  starts_at timestamptz not null, duration_minutes int not null, platform text not null check(platform in ('zoom','google_meet','youtube_live')),
  meeting_url text, status text not null default 'draft' check(status in ('draft','scheduled','cancelled','completed')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(duration_minutes > 0), check(course_id is not null or batch_id is not null)
);
create table public.market_scenarios (
  id uuid primary key default gen_random_uuid(), pair text not null, direction text check(direction in ('buy','sell','watching')),
  chart_path text, entry text, stop_loss text, target text, description text, commentary text,
  visibility public.scenario_visibility not null default 'private', published_at timestamptz, scheduled_at timestamptz,
  created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.announcements (
  id uuid primary key default gen_random_uuid(), title text not null, body text not null,
  audience text not null default 'students' check(audience in ('public','students','both')),
  is_published boolean not null default false, published_at timestamptz, created_at timestamptz not null default now()
);
create table public.testimonials (
  id uuid primary key default gen_random_uuid(), display_name text not null, quote text not null,
  attribution text, is_published boolean not null default false, sort_order int not null default 0, created_at timestamptz not null default now()
);
create table public.cms_pages (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null,
  is_published boolean not null default false, updated_at timestamptz not null default now()
);
create table public.cms_sections (
  id uuid primary key default gen_random_uuid(), page_id uuid references public.cms_pages(id) on delete cascade,
  section_key text not null, content jsonb not null default '{}', sort_order int not null default 0,
  updated_at timestamptz not null default now(), unique(page_id,section_key)
);
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  subject text not null, message text not null, status text not null default 'new' check(status in ('new','read','closed')),
  created_at timestamptz not null default now()
);
create table public.notification_preferences (
  student_id uuid primary key references auth.users(id) on delete cascade, email_enabled boolean not null default true,
  telegram_chat_id text unique, telegram_authorized_at timestamptz, created_at timestamptz not null default now()
);
create table public.notification_logs (
  id uuid primary key default gen_random_uuid(), broadcast_id uuid not null, student_id uuid references auth.users(id) on delete set null,
  channel text not null check(channel in ('email','telegram')), provider_message_id text,
  status text not null check(status in ('queued','sent','failed','skipped')), error text,
  created_at timestamptz not null default now(), unique(broadcast_id,student_id,channel)
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id) on delete set null,
  action text not null, entity_type text not null, entity_id uuid, metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create table public.lesson_progress (
  student_id uuid not null references auth.users(id) on delete cascade, lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz, last_position_seconds int not null default 0, updated_at timestamptz not null default now(),
  primary key(student_id,lesson_id), check(last_position_seconds >= 0)
);

create index enrollments_student_status_idx on public.enrollments(student_id,status);
create index enrollments_course_idx on public.enrollments(course_id);
create index payments_student_created_idx on public.payments(student_id,created_at desc);
create index payments_status_idx on public.payments(status);
create index live_classes_start_status_idx on public.live_classes(starts_at,status);
create index scenarios_visibility_date_idx on public.market_scenarios(visibility,published_at desc);
create index sessions_student_active_idx on public.student_sessions(student_id,last_seen_at desc) where revoked_at is null;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.user_roles where user_id=auth.uid() and role='admin');
$$;
create or replace function public.has_active_enrollment(p_course uuid) returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.enrollments e where e.student_id=auth.uid() and e.course_id=p_course and e.status='active' and (e.expires_at is null or e.expires_at>now()));
$$;
create or replace function public.can_view_live_class(p_course uuid,p_batch uuid) returns boolean language sql stable security definer set search_path=public as $$
 select public.is_admin() or exists(select 1 from public.enrollments e where e.student_id=auth.uid() and e.status='active' and (e.expires_at is null or e.expires_at>now()) and (p_course is null or e.course_id=p_course) and (p_batch is null or e.batch_id=p_batch));
$$;

-- Called only by the signed Razorpay webhook using the server-only service key.
create or replace function public.confirm_razorpay_payment(p_order_id text,p_payment_id text,p_event_id text,p_amount_minor bigint,p_currency text)
returns void language plpgsql security definer set search_path=public as $$
declare payment_row public.payments%rowtype;
begin
 select * into payment_row from public.payments where provider='razorpay' and provider_order_id=p_order_id for update;
 if not found then raise exception 'unknown payment order'; end if;
 if payment_row.status='succeeded' and payment_row.provider_payment_id=p_payment_id then return; end if;
 if payment_row.status<>'pending' then raise exception 'payment is not pending'; end if;
 if (payment_row.amount*100)::bigint<>p_amount_minor or upper(payment_row.currency)<>upper(p_currency) then raise exception 'payment amount mismatch'; end if;
 update public.payments set status='succeeded',provider_payment_id=p_payment_id,verified_at=now(),webhook_event_id=p_event_id,updated_at=now() where id=payment_row.id;
 insert into public.enrollments(student_id,course_id,payment_id,status,activated_at)
 values(payment_row.student_id,payment_row.course_id,payment_row.id,'active',now())
 on conflict(student_id,course_id) do update set status='active',payment_id=excluded.payment_id,activated_at=excluded.activated_at,updated_at=now();
 insert into public.invoices(payment_id,invoice_number) values(payment_row.id,'CG-'||to_char(now(),'YYYYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))) on conflict(payment_id) do nothing;
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(null,'payment.confirmed','payment',payment_row.id,jsonb_build_object('provider','razorpay','provider_payment_id',p_payment_id));
end $$;
revoke all on function public.confirm_razorpay_payment(text,text,text,bigint,text) from public,anon,authenticated;
grant execute on function public.confirm_razorpay_payment(text,text,text,bigint,text) to service_role;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,full_name,phone) values(new.id,new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'phone');
 insert into public.user_roles(user_id,role) values(new.id,'student') on conflict do nothing;
 return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.batches enable row level security;
alter table public.courses enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.student_sessions enable row level security;
alter table public.live_classes enable row level security;
alter table public.market_scenarios enable row level security;
alter table public.announcements enable row level security;
alter table public.testimonials enable row level security;
alter table public.cms_pages enable row level security;
alter table public.cms_sections enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_logs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.lesson_progress enable row level security;

create policy "profiles self or admin read" on public.profiles for select using(id=auth.uid() or public.is_admin());
create policy "profiles self update" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy "roles self read or admin" on public.user_roles for select using(user_id=auth.uid() or public.is_admin());
create policy "admin manages roles" on public.user_roles for all using(public.is_admin()) with check(public.is_admin());
create policy "public sees published courses" on public.courses for select using(is_published and archived_at is null or public.is_admin());
create policy "admin manages courses" on public.courses for all using(public.is_admin()) with check(public.is_admin());
create policy "public sees mentors" on public.mentor_profiles for select using(is_published or public.is_admin());
create policy "admin manages mentors" on public.mentor_profiles for all using(public.is_admin()) with check(public.is_admin());
create policy "enrolled students see modules" on public.course_modules for select using(public.is_admin() or (is_published and public.has_active_enrollment(course_id)));
create policy "admin manages modules" on public.course_modules for all using(public.is_admin()) with check(public.is_admin());
create policy "enrolled students see lessons" on public.lessons for select using(public.is_admin() or (is_published and exists(select 1 from public.course_modules m where m.id=module_id and public.has_active_enrollment(m.course_id))));
create policy "admin manages lessons" on public.lessons for all using(public.is_admin()) with check(public.is_admin());
create policy "students see own enrollments" on public.enrollments for select using(student_id=auth.uid() or public.is_admin());
create policy "admin manages enrollments" on public.enrollments for all using(public.is_admin()) with check(public.is_admin());
create policy "students see own payments" on public.payments for select using(student_id=auth.uid() or public.is_admin());
create policy "admin manages payments" on public.payments for all using(public.is_admin()) with check(public.is_admin());
create policy "students see own invoices" on public.invoices for select using(public.is_admin() or exists(select 1 from public.payments p where p.id=payment_id and p.student_id=auth.uid() and p.status='succeeded'));
create policy "admin manages invoices" on public.invoices for all using(public.is_admin()) with check(public.is_admin());
create policy "student sessions self or admin" on public.student_sessions for select using(student_id=auth.uid() or public.is_admin());
create policy "student sessions self create" on public.student_sessions for insert with check(student_id=auth.uid());
create policy "student sessions self revoke" on public.student_sessions for update using(student_id=auth.uid() or public.is_admin()) with check(student_id=auth.uid() or public.is_admin());
create policy "students see assigned live classes" on public.live_classes for select using(status='scheduled' and public.can_view_live_class(course_id,batch_id) or public.is_admin());
create policy "admin manages live classes" on public.live_classes for all using(public.is_admin()) with check(public.is_admin());
create policy "public scenarios" on public.market_scenarios for select using(visibility in ('public','both') and published_at is not null and published_at<=now() or public.is_admin());
create policy "enrolled students scenarios" on public.market_scenarios for select using(visibility in ('students','both') and published_at is not null and published_at<=now() and exists(select 1 from public.enrollments e where e.student_id=auth.uid() and e.status='active') or public.is_admin());
create policy "admin manages scenarios" on public.market_scenarios for all using(public.is_admin()) with check(public.is_admin());
create policy "public announcements" on public.announcements for select using(is_published and audience in ('public','both') or public.is_admin());
create policy "student announcements" on public.announcements for select using(is_published and audience in ('students','both') and auth.uid() is not null or public.is_admin());
create policy "admin manages announcements" on public.announcements for all using(public.is_admin()) with check(public.is_admin());
create policy "public testimonials" on public.testimonials for select using(is_published or public.is_admin());
create policy "admin manages testimonials" on public.testimonials for all using(public.is_admin()) with check(public.is_admin());
create policy "public cms pages" on public.cms_pages for select using(is_published or public.is_admin());
create policy "admin manages cms pages" on public.cms_pages for all using(public.is_admin()) with check(public.is_admin());
create policy "cms sections through page" on public.cms_sections for select using(public.is_admin() or exists(select 1 from public.cms_pages p where p.id=page_id and p.is_published));
create policy "admin manages cms sections" on public.cms_sections for all using(public.is_admin()) with check(public.is_admin());
create policy "public contact submission" on public.contact_submissions for insert with check(true);
create policy "admin reviews contact" on public.contact_submissions for select using(public.is_admin());
create policy "admin updates contact" on public.contact_submissions for update using(public.is_admin()) with check(public.is_admin());
create policy "preferences self or admin" on public.notification_preferences for select using(student_id=auth.uid() or public.is_admin());
create policy "preferences self update" on public.notification_preferences for insert with check(student_id=auth.uid());
create policy "preferences self edit" on public.notification_preferences for update using(student_id=auth.uid()) with check(student_id=auth.uid());
create policy "admin sees notification logs" on public.notification_logs for select using(public.is_admin());
create policy "admin manages notification logs" on public.notification_logs for all using(public.is_admin()) with check(public.is_admin());
create policy "audit admin read" on public.audit_logs for select using(public.is_admin());
create policy "admin writes audit" on public.audit_logs for insert with check(public.is_admin());
create policy "progress self or admin read" on public.lesson_progress for select using(student_id=auth.uid() or public.is_admin());
create policy "progress self with enrollment" on public.lesson_progress for insert with check(student_id=auth.uid() and exists(select 1 from public.lessons l join public.course_modules m on m.id=l.module_id where l.id=lesson_id and public.has_active_enrollment(m.course_id)));
create policy "progress self update with enrollment" on public.lesson_progress for update using(student_id=auth.uid()) with check(student_id=auth.uid() and exists(select 1 from public.lessons l join public.course_modules m on m.id=l.module_id where l.id=lesson_id and public.has_active_enrollment(m.course_id)));

-- Seed exactly six editable course placeholders; never invent names, prices, or curriculum.
insert into public.courses(id,slug,title,short_description,full_description,sort_order,is_published)
select ('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,'program-'||lpad(n::text,2,'0'),'Course title to be confirmed','Course information will be published by the academy team.','Course details pending confirmation.',n,false
from generate_series(1,6) n;

insert into public.cms_pages(slug,title,is_published) values
 ('home','Homepage',true),('about','About Corpenta Global',true),('contact','Contact information',true),
 ('terms','Terms & Conditions',false),('refunds','Refund Policy',false),('risk','Forex Trading Risk Disclaimer',false)
on conflict(slug) do nothing;
