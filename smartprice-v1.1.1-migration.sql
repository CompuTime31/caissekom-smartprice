-- Caissekom SmartPrice v1.1.1 — tables et politiques de test
create extension if not exists pgcrypto;

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

alter table public.products enable row level security;
alter table public.stores enable row level security;

drop policy if exists "smartprice products read" on public.products;
drop policy if exists "smartprice products write test" on public.products;
drop policy if exists "smartprice stores read" on public.stores;
drop policy if exists "smartprice stores write test" on public.stores;

create policy "smartprice products read" on public.products for select to anon using (active = true);
create policy "smartprice products write test" on public.products for all to anon using (true) with check (true);
create policy "smartprice stores read" on public.stores for select to anon using (true);
create policy "smartprice stores write test" on public.stores for all to anon using (true) with check (true);

grant usage on schema public to anon;
grant select, insert, update, delete on public.products to anon;
grant select, insert, update, delete on public.stores to anon;

insert into public.stores (id,name)
values ('00000000-0000-0000-0000-000000000001','CompuTime')
on conflict (id) do nothing;

notify pgrst, 'reload schema';
