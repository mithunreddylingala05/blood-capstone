-- ============================================================
-- Smart Blood Connect — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- PROFILES TABLE (replaces Firebase 'users' collection)
create table if not exists profiles (
  id              uuid references auth.users on delete cascade primary key,
  name            text not null,
  phone           text,
  email           text,
  blood_group     text,
  location        text,
  city            text,
  state           text,
  role            text default 'donor',   -- donor | patient | hospital | blood_bank | admin
  total_donations int  default 0,
  rating          float default 0.0,
  is_available    boolean default true,
  latitude        float,
  longitude       float,
  blood_stock     jsonb,                  -- hospitals only: {"A+": 5, "B+": 3, ...}
  last_donated    timestamptz,
  next_eligible   timestamptz,
  age             int,
  gender          text,
  created_at      timestamptz default now()
);

-- BLOOD REQUESTS TABLE (replaces Firebase 'blood_requests' collection)
create table if not exists blood_requests (
  id                 uuid default gen_random_uuid() primary key,
  patient_name       text not null,
  blood_group        text not null,
  hospital_name      text not null,
  hospital_location  text not null,
  units_required     int  default 1,
  urgency            int  default 2,  -- 0=critical, 1=urgent, 2=normal
  status             int  default 0,  -- 0=pending, 1=accepted, 2=fulfilled, 3=cancelled
  requested_by       uuid references profiles(id) on delete set null,
  accepted_donor_id  uuid references profiles(id) on delete set null,
  latitude           float,
  longitude          float,
  created_at         timestamptz default now()
);

-- NOTIFICATIONS TABLE (replaces Firebase 'notifications' collection)
create table if not exists notifications (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references profiles(id) on delete cascade,
  title      text not null,
  message    text not null,
  type       int  default 2,   -- 0=urgent, 1=success, 2=info, 3=warning
  is_read    boolean default false,
  metadata   jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles      enable row level security;
alter table blood_requests enable row level security;
alter table notifications  enable row level security;

-- PROFILES POLICIES
create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- BLOOD REQUESTS POLICIES
create policy "Blood requests are viewable by everyone"
  on blood_requests for select using (true);

create policy "Authenticated users can create blood requests"
  on blood_requests for insert with check (auth.uid() = requested_by);

create policy "Owners and accepted donors can update requests"
  on blood_requests for update
  using (auth.uid() = requested_by or auth.uid() = accepted_donor_id);

-- NOTIFICATIONS POLICIES
create policy "Users can view their own notifications"
  on notifications for select using (auth.uid() = user_id);

create policy "System can insert notifications for any user"
  on notifications for insert with check (true);

create policy "Users can update their own notifications"
  on notifications for update using (auth.uid() = user_id);

-- ============================================================
-- INDEXES (for performance)
-- ============================================================
create index if not exists idx_profiles_blood_group on profiles(blood_group);
create index if not exists idx_profiles_city        on profiles(city);
create index if not exists idx_profiles_state       on profiles(state);
create index if not exists idx_profiles_role        on profiles(role);
create index if not exists idx_requests_status      on blood_requests(status);
create index if not exists idx_requests_blood_group on blood_requests(blood_group);
create index if not exists idx_requests_requested_by on blood_requests(requested_by);
create index if not exists idx_notifications_user_id on notifications(user_id);
create index if not exists idx_notifications_is_read on notifications(is_read);
