-- Caissekom SmartPrice v1.1
-- Supabase > SQL Editor > New query > coller > Run

create extension if not exists pgcrypto;

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  website text,
  logo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  barcode text not null unique,
  designation text not null,
  price numeric(12,2) not null default 0,
  category text,
  image text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_barcode on public.products(barcode);
create index if not exists idx_products_designation on public.products(designation);
create index if not exists idx_products_active on public.products(active);

alter table public.products enable row level security;
alter table public.stores enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.products to anon, authenticated;
grant select, insert, update, delete on table public.stores to anon, authenticated;

-- Supprime les anciennes règles pour rendre le script réexécutable.
drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Public can read stores" on public.stores;
drop policy if exists "SmartPrice development insert products" on public.products;
drop policy if exists "SmartPrice development update products" on public.products;
drop policy if exists "SmartPrice development delete products" on public.products;
drop policy if exists "SmartPrice development insert stores" on public.stores;
drop policy if exists "SmartPrice development update stores" on public.stores;
drop policy if exists "SmartPrice v1.1 read products" on public.products;
drop policy if exists "SmartPrice v1.1 write products" on public.products;
drop policy if exists "SmartPrice v1.1 read stores" on public.stores;
drop policy if exists "SmartPrice v1.1 write stores" on public.stores;

create policy "SmartPrice v1.1 read products"
on public.products for select to anon, authenticated
using (active = true);

-- Temporaire pendant le développement. Sera remplacé par Supabase Auth.
create policy "SmartPrice v1.1 write products"
on public.products for all to anon, authenticated
using (true) with check (true);

create policy "SmartPrice v1.1 read stores"
on public.stores for select to anon, authenticated
using (true);

create policy "SmartPrice v1.1 write stores"
on public.stores for all to anon, authenticated
using (true) with check (true);

insert into public.stores (id,name)
values ('00000000-0000-0000-0000-000000000001','SmartPrice')
on conflict (id) do nothing;

-- Force PostgREST à recharger les nouvelles tables et permissions.
notify pgrst, 'reload schema';
