-- Enable Row Level Security (RLS) if not already enabled (it should be)
-- alter table public.intersections enable row level security;
-- alter table public.alerts enable row level security;

-- Policy to allow anonymous (public) seed data insertion for intersections
create policy "Allow public insert on intersections"
  on public.intersections for insert
  with check (true);

-- Policy to allow anonymous (public) seed data insertion for alerts
create policy "Allow public insert on alerts"
  on public.alerts for insert
  with check (true);

-- NOTE: In a real production app, you would restrict this to authenticated users only.
-- But for this demo without full Auth implementation, we allow public insert to enable the 'Seed Data' feature.
