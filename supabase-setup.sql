-- Caissekom SmartPrice v1.0-alpha3 — Supabase
create table if not exists public.smartprice_articles (
  code text primary key,
  designation text not null,
  prix numeric not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.smartprice_settings (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.smartprice_articles enable row level security;
alter table public.smartprice_settings enable row level security;
create policy "Public read articles" on public.smartprice_articles for select using (true);
create policy "Public write articles alpha" on public.smartprice_articles for all using (true) with check (true);
create policy "Public read settings" on public.smartprice_settings for select using (true);
create policy "Public write settings alpha" on public.smartprice_settings for all using (true) with check (true);
-- Important : ces règles ouvertes servent uniquement à la phase alpha.
-- Elles seront remplacées par une authentification Supabase stricte dans alpha4.
