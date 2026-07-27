-- Caissekom SmartPrice v1.7 — Catalogue intelligent
-- À exécuter après les migrations précédentes.
alter table public.store_products add column if not exists brand text;
alter table public.store_products add column if not exists category text;
alter table public.store_products add column if not exists manufacturer_ref text;
alter table public.store_products add column if not exists description text;
alter table public.store_products add column if not exists specifications text;
alter table public.store_products add column if not exists promo_price numeric(14,2);
alter table public.store_products add column if not exists promo_start timestamptz;
alter table public.store_products add column if not exists promo_end timestamptz;
alter table public.store_products add column if not exists featured boolean not null default false;
alter table public.store_products add column if not exists is_new boolean not null default false;
alter table public.store_products add column if not exists images jsonb not null default '[]'::jsonb;
alter table public.store_products add column if not exists related_codes jsonb not null default '[]'::jsonb;
alter table public.store_products add column if not exists availability text not null default 'available';
create index if not exists store_products_brand_idx on public.store_products(store_id, brand);
create index if not exists store_products_category_idx on public.store_products(store_id, category);
create index if not exists store_products_featured_idx on public.store_products(store_id, featured) where featured=true;
notify pgrst, 'reload schema';
