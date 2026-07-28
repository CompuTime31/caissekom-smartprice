-- Caissekom SmartPrice v1.8 Studio Beta 2
-- Exécuter après toutes les migrations précédentes.
create table if not exists public.smartprice_settings (
  store_id uuid primary key references public.stores(id) on delete cascade,
  configuration jsonb not null default '{}'::jsonb,
  version text not null default '1.8-beta2',
  updated_at timestamptz not null default now()
);
alter table public.smartprice_settings add column if not exists version text not null default '1.8-beta2';
alter table public.smartprice_settings add column if not exists updated_at timestamptz not null default now();
alter table public.smartprice_settings enable row level security;
drop policy if exists "public read smartprice settings" on public.smartprice_settings;
create policy "public read smartprice settings" on public.smartprice_settings for select using (true);
-- Politique prototype. En production, limiter l'écriture aux utilisateurs authentifiés du magasin.
drop policy if exists "prototype write smartprice settings" on public.smartprice_settings;
create policy "prototype write smartprice settings" on public.smartprice_settings for all using (true) with check (true);
create index if not exists smartprice_settings_updated_idx on public.smartprice_settings(updated_at desc);
