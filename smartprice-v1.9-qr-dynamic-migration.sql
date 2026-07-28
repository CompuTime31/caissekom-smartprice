-- Caissekom SmartPrice v1.9 Beta 1
-- QR dynamiques temporaires et validation atomique
create extension if not exists pgcrypto;

create table if not exists public.smartprice_access_tokens (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  token_hash text not null unique,
  label text,
  expires_at timestamptz not null,
  max_uses integer not null default 100 check (max_uses > 0),
  use_count integer not null default 0 check (use_count >= 0),
  session_minutes integer not null default 120 check (session_minutes between 1 and 1440),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists smartprice_access_tokens_store_idx on public.smartprice_access_tokens(store_id,created_at desc);
create index if not exists smartprice_access_tokens_hash_idx on public.smartprice_access_tokens(token_hash);

alter table public.smartprice_access_tokens enable row level security;

-- Politiques adaptées au prototype actuel utilisant la clé publique.
-- Pour la production commerciale, remplacer l'administration locale par Supabase Auth
-- et limiter INSERT/SELECT/UPDATE aux utilisateurs authentifiés du magasin.
drop policy if exists "smartprice access tokens read" on public.smartprice_access_tokens;
create policy "smartprice access tokens read" on public.smartprice_access_tokens for select to anon, authenticated using (true);
drop policy if exists "smartprice access tokens create" on public.smartprice_access_tokens;
create policy "smartprice access tokens create" on public.smartprice_access_tokens for insert to anon, authenticated with check (true);
drop policy if exists "smartprice access tokens update" on public.smartprice_access_tokens;
create policy "smartprice access tokens update" on public.smartprice_access_tokens for update to anon, authenticated using (true) with check (true);

create or replace function public.smartprice_validate_access_token(p_token_hash text,p_store_id uuid default null)
returns table(valid boolean,message text,reason text,token_id uuid,store_id uuid,session_minutes integer,expires_at timestamptz)
language plpgsql
security definer
set search_path=public
as $$
declare v public.smartprice_access_tokens%rowtype;
begin
  select * into v from public.smartprice_access_tokens t
  where t.token_hash=p_token_hash and (p_store_id is null or t.store_id=p_store_id)
  for update;
  if not found then return query select false,'QR Code inconnu','Jeton introuvable',null::uuid,null::uuid,null::integer,null::timestamptz;return;end if;
  if not v.active then return query select false,'QR Code désactivé','Ce QR a été désactivé par le magasin',v.id,v.store_id,v.session_minutes,v.expires_at;return;end if;
  if v.expires_at<=now() then return query select false,'QR Code expiré','La période de validité est terminée',v.id,v.store_id,v.session_minutes,v.expires_at;return;end if;
  if v.use_count>=v.max_uses then return query select false,'Limite atteinte','Le nombre maximal d’utilisations est atteint',v.id,v.store_id,v.session_minutes,v.expires_at;return;end if;
  update public.smartprice_access_tokens set use_count=use_count+1,last_used_at=now() where id=v.id;
  return query select true,'Accès autorisé','',v.id,v.store_id,v.session_minutes,v.expires_at;
end;$$;

revoke all on function public.smartprice_validate_access_token(text,uuid) from public;
grant execute on function public.smartprice_validate_access_token(text,uuid) to anon,authenticated;
grant select,insert,update on public.smartprice_access_tokens to anon,authenticated;
