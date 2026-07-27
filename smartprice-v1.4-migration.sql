-- Caissekom SmartPrice v1.4 — Multi-magasins
create extension if not exists pgcrypto;

alter table public.stores alter column id set default gen_random_uuid();
insert into public.stores (id,name,updated_at)
values ('00000000-0000-0000-0000-000000000001','Magasin principal',now())
on conflict (id) do nothing;

create table if not exists public.store_products (
  store_id uuid not null references public.stores(id) on delete cascade,
  barcode text not null,
  designation text not null,
  price numeric(14,2) not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (store_id, barcode)
);
create index if not exists store_products_store_active_idx on public.store_products(store_id,active);
create index if not exists store_products_designation_idx on public.store_products(store_id,designation);

alter table public.imports add column if not exists store_id uuid references public.stores(id) on delete set null;

-- Migration du catalogue v1.3 vers le magasin principal
insert into public.store_products(store_id,barcode,designation,price,active,updated_at)
select '00000000-0000-0000-0000-000000000001',barcode,designation,price,active,updated_at
from public.products
on conflict (store_id,barcode) do nothing;

alter table public.store_products enable row level security;
drop policy if exists "public read store_products" on public.store_products;
create policy "public read store_products" on public.store_products for select using (true);
drop policy if exists "public write store_products" on public.store_products;
create policy "public write store_products" on public.store_products for all using (true) with check (true);

-- Politiques magasins nécessaires à la v1.4 prototype
drop policy if exists "public read stores" on public.stores;
create policy "public read stores" on public.stores for select using (true);
drop policy if exists "public write stores" on public.stores;
create policy "public write stores" on public.stores for all using (true) with check (true);

notify pgrst, 'reload schema';
