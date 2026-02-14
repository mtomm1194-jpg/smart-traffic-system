-- Create intersections table
create table public.intersections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null check (status in ('online', 'offline', 'warning')),
  traffic_flow integer default 0,
  avg_speed integer default 0,
  congestion_level text check (congestion_level in ('low', 'moderate', 'heavy', 'severe')),
  signal_phase text,
  count_down integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create alerts table
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('accident', 'congestion', 'device', 'emergency')),
  title text not null,
  description text,
  time timestamp with time zone default timezone('utc'::text, now()) not null,
  location text,
  status text not null check (status in ('pending', 'processing', 'resolved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.intersections enable row level security;
alter table public.alerts enable row level security;

-- Create policies to allow public read access (Modify as needed for production)
create policy "Allow public read access on intersections"
  on public.intersections for select
  using (true);

create policy "Allow public read access on alerts"
  on public.alerts for select
  using (true);

-- Create policies to allow authenticated insert/update (Optional, based on need)
-- create policy "Allow authenticated insert on intersections"
--   on public.intersections for insert
--   with check (auth.role() = 'authenticated');
