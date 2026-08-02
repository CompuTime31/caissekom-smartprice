-- SmartPrice Enterprise v3.0 RC1 - schéma initial
create extension if not exists pgcrypto;

create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null, code text unique not null, address text, phone text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(), name text unique not null,
  permissions jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null, phone text, role_id uuid references roles(id),
  primary_store_id uuid references stores(id), active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists modules (
  id text primary key, name text not null, enabled boolean not null default true,
  visible boolean not null default true, settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(), name text not null, parent_id uuid references categories(id),
  active boolean not null default true, created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(), designation text not null, reference text,
  barcode text unique, category_id uuid references categories(id), sale_price numeric(14,2) not null default 0,
  stock numeric(14,3) not null default 0, active boolean not null default true,
  sync_status text not null default 'pending' check(sync_status in ('synced','pending','error')),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigint generated always as identity primary key, user_id uuid references auth.users(id),
  module text not null, action text not null, details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id bigint generated always as identity primary key, title text not null, message text not null,
  severity text not null default 'info', read boolean not null default false, created_at timestamptz not null default now()
);

create table if not exists sync_jobs (
  id bigint generated always as identity primary key, store_id uuid references stores(id),
  job_type text not null, status text not null default 'pending', processed integer not null default 0,
  errors integer not null default 0, started_at timestamptz, finished_at timestamptz, created_at timestamptz not null default now()
);

alter table stores enable row level security;
alter table roles enable row level security;
alter table profiles enable row level security;
alter table modules enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table audit_logs enable row level security;
alter table notifications enable row level security;
alter table sync_jobs enable row level security;
