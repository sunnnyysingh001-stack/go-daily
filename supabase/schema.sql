-- Run once in Supabase SQL Editor. No service-role key is used by the app.
create table if not exists public.study_backups (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload)='object' and octet_length(payload::text)<=1500000),
 updated_at timestamptz not null default now()
);
alter table public.study_backups enable row level security;
revoke all on public.study_backups from anon;
grant select,insert,update,delete on public.study_backups to authenticated;
create policy "read own backup" on public.study_backups for select to authenticated using ((select auth.uid())=user_id);
create policy "insert own backup" on public.study_backups for insert to authenticated with check ((select auth.uid())=user_id);
create policy "update own backup" on public.study_backups for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "delete own backup" on public.study_backups for delete to authenticated using ((select auth.uid())=user_id);
create or replace function public.delete_my_account() returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 delete from auth.users where id=auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public,anon;
grant execute on function public.delete_my_account() to authenticated;
