-- =========================================================================
-- SaarthiAI Database Schema
-- Optimized for patient privacy, deterministic analysis, and consultation sharing
-- =========================================================================

-- 1. APPOINTMENTS TABLE
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique,
  doctor_id text not null,
  doctor_name text not null,
  patient_name text not null,
  patient_phone text not null,
  patient_notes text,
  appointment_date text not null,
  slot_time text not null,
  consultation_fee text,
  report_consent boolean not null default false,
  report_name text,
  access_token text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Index on booking_id for quick lookup
create index if not exists idx_appointments_booking_id on public.appointments(booking_id);

-- Enable RLS
alter table public.appointments enable row level security;

-- Drop any existing policies to avoid conflicts
drop policy if exists "Enable insert for all clients" on public.appointments;
drop policy if exists "Enable read for all clients" on public.appointments;

-- Policies for appointments
create policy "Enable insert for all clients" on public.appointments
  for insert
  to anon, authenticated
  with check (true);

create policy "Enable read for all clients" on public.appointments
  for select
  to anon, authenticated
  using (true);

-- 2. VERIFIED LABORATORY REPORTS TABLE
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  report_id text not null unique,
  document_id text not null,
  file_name text not null,
  total_tests integer not null default 0,
  in_range_count integer not null default 0,
  above_range_count integer not null default 0,
  below_range_count integer not null default 0,
  review_required_count integer not null default 0,
  no_verified_range_count integer not null default 0,
  verified_count integer not null default 0,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Index on report_id for fast retrieval
create index if not exists idx_reports_report_id on public.reports(report_id);

-- Enable RLS
alter table public.reports enable row level security;

drop policy if exists "Enable insert for reports" on public.reports;
drop policy if exists "Enable read for reports" on public.reports;

create policy "Enable insert for reports" on public.reports
  for insert
  to anon, authenticated
  with check (true);

create policy "Enable read for reports" on public.reports
  for select
  to anon, authenticated
  using (true);

-- 3. DOUBT SESSIONS TABLE
create table if not exists public.doubt_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  language text not null default 'en',
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_doubt_sessions_session_id on public.doubt_sessions(session_id);

alter table public.doubt_sessions enable row level security;

drop policy if exists "Enable all for doubt sessions" on public.doubt_sessions;

create policy "Enable all for doubt sessions" on public.doubt_sessions
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Grant schema access
grant usage on schema public to anon, authenticated;
grant all on table public.appointments to anon, authenticated;
grant all on table public.reports to anon, authenticated;
grant all on table public.doubt_sessions to anon, authenticated;
