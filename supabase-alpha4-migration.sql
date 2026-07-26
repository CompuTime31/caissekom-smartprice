-- Caissekom SmartPrice v1.0-alpha4
-- À exécuter une seule fois dans Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  website text,
  logo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  barcode text not null unique,
  designation text not null,
  price numeric(12,2) not null default 0,
  category text,
  image text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_products_barcode on public.products(barcode);
create index if not exists idx_products_designation on public.products(designation);

alter table public.products enable row level security;
alter table public.stores enable row level security;

-- Nettoyage des anciennes policies du prototype, si elles existent.
drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Public can read stores" on public.stores;
drop policy if exists "SmartPrice development insert products" on public.products;
drop policy if exists "SmartPrice development update products" on public.products;
drop policy if exists "SmartPrice development delete products" on public.products;
drop policy if exists "SmartPrice development insert stores" on public.stores;
drop policy if exists "SmartPrice development update stores" on public.stores;

create policy "Public can read active products"
on public.products for select to anon
using (active = true);

create policy "Public can read stores"
on public.stores for select to anon
using (true);

-- Policies temporaires pour la phase de développement alpha4.
-- Elles permettent à l'administration actuelle d'importer avec la publishable key.
-- Elles seront remplacées par Supabase Auth avant la version 1.0 finale.
create policy "SmartPrice development insert products"
on public.products for insert to anon
with check (true);

create policy "SmartPrice development update products"
on public.products for update to anon
using (true) with check (true);

create policy "SmartPrice development delete products"
on public.products for delete to anon
using (true);

create policy "SmartPrice development insert stores"
on public.stores for insert to anon
with check (true);

create policy "SmartPrice development update stores"
on public.stores for update to anon
using (true) with check (true);

insert into public.stores (id,name)
values ('00000000-0000-0000-0000-000000000001','SmartPrice')
on conflict (id) do nothing;
