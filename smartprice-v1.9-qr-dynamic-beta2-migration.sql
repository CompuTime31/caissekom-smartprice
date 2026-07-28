-- Caissekom SmartPrice v1.9 QR Dynamic Beta 2
create extension if not exists pgcrypto;

alter table public.smartprice_access_tokens add column if not exists point_of_sale text;
alter table public.smartprice_access_tokens add column if not exists allow_reuse boolean not null default true;
alter table public.smartprice_access_tokens add column if not exists single_device boolean not null default false;
alter table public.smartprice_access_tokens add column if not exists bound_device_id text;

create table if not exists public.smartprice_access_logs (
  id bigserial primary key,
  token_id uuid references public.smartprice_access_tokens(id) on delete set null,
  store_id uuid not null references public.stores(id) on delete cascade,
  created_at timestamptz not null default now(),
  result text not null check (result in ('accepted','denied')),
  reason text,
  device_id text,
  user_agent text
);
create index if not exists smartprice_access_logs_store_date_idx on public.smartprice_access_logs(store_id,created_at desc);
alter table public.smartprice_access_logs enable row level security;
drop policy if exists "smartprice access logs read" on public.smartprice_access_logs;
create policy "smartprice access logs read" on public.smartprice_access_logs for select to anon,authenticated using (true);
grant select on public.smartprice_access_logs to anon,authenticated;

create or replace function public.smartprice_validate_access_token_v2(p_token_hash text,p_store_id uuid default null,p_device_id text default null,p_user_agent text default null)
returns table(valid boolean,message text,reason text,token_id uuid,store_id uuid,session_minutes integer,expires_at timestamptz)
language plpgsql security definer set search_path=public as $$
declare v public.smartprice_access_tokens%rowtype; deny_reason text;
begin
  select * into v from public.smartprice_access_tokens t where t.token_hash=p_token_hash and (p_store_id is null or t.store_id=p_store_id) for update;
  if not found then return query select false,'QR Code inconnu','Jeton introuvable',null::uuid,null::uuid,null::integer,null::timestamptz; return; end if;
  if not v.active then deny_reason:='QR désactivé';
  elsif v.expires_at<=now() then deny_reason:='QR expiré';
  elsif v.use_count>=v.max_uses then deny_reason:='Limite d’utilisations atteinte';
  elsif not v.allow_reuse and v.use_count>0 then deny_reason:='QR déjà utilisé';
  elsif v.single_device and v.bound_device_id is not null and coalesce(p_device_id,'')<>v.bound_device_id then deny_reason:='QR verrouillé sur un autre appareil';
  end if;
  if deny_reason is not null then
    insert into public.smartprice_access_logs(token_id,store_id,result,reason,device_id,user_agent) values(v.id,v.store_id,'denied',deny_reason,p_device_id,p_user_agent);
    return query select false,'Accès refusé',deny_reason,v.id,v.store_id,v.session_minutes,v.expires_at; return;
  end if;
  update public.smartprice_access_tokens set use_count=use_count+1,last_used_at=now(),bound_device_id=case when single_device and bound_device_id is null then p_device_id else bound_device_id end where id=v.id;
  insert into public.smartprice_access_logs(token_id,store_id,result,reason,device_id,user_agent) values(v.id,v.store_id,'accepted','Accès autorisé',p_device_id,p_user_agent);
  return query select true,'Accès autorisé','',v.id,v.store_id,v.session_minutes,v.expires_at;
end;$$;
revoke all on function public.smartprice_validate_access_token_v2(text,uuid,text,text) from public;
grant execute on function public.smartprice_validate_access_token_v2(text,uuid,text,text) to anon,authenticated;

create or replace function public.smartprice_access_dashboard(p_store_id uuid)
returns table(active_qr bigint,expired_qr bigint,scans_today bigint,denied_today bigint)
language sql security definer set search_path=public as $$
 select
  (select count(*) from smartprice_access_tokens where store_id=p_store_id and active and expires_at>now() and use_count<max_uses),
  (select count(*) from smartprice_access_tokens where store_id=p_store_id and expires_at<=now()),
  (select count(*) from smartprice_access_logs where store_id=p_store_id and created_at>=date_trunc('day',now())),
  (select count(*) from smartprice_access_logs where store_id=p_store_id and result='denied' and created_at>=date_trunc('day',now()));
$$;
grant execute on function public.smartprice_access_dashboard(uuid) to anon,authenticated;
