-- Street Sound Map 区切り2：テーブルと決まり（RLS）
-- Supabase の SQL Editor に全部貼って、1回だけ実行する

-- PostGIS は 2025 年に有効にしたものを使う（なければ extensions に入れる）
create extension if not exists postgis with schema extensions;

-- 2025年に作った古いテーブルは消さずに archive に移す（中身はそのまま残る）
create schema if not exists archive;
alter table if exists public.places set schema archive;
alter table if exists public.flyway_schema_history set schema archive;

-- ───── エリア ─────
create table public.areas (
  slug text primary key,
  name text not null,
  center_lng double precision not null,
  center_lat double precision not null,
  zoom real not null default 11
);
insert into public.areas (slug, name, center_lng, center_lat, zoom)
values ('tokyo', '東京', 139.7671, 35.6812, 10.5);

-- ───── プロフィール（表示名だけ。メールアドレスは持たない） ─────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 30),
  created_at timestamptz not null default now()
);

-- ログインした人のプロフィールを自動で作る。
-- Google の本名を勝手に公開しないよう、最初の表示名は「演奏者 + 番号」にする
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, '演奏者' || substr(replace(new.id::text, '-', ''), 1, 6));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───── 場所 ─────
create table public.places (
  id uuid primary key default gen_random_uuid(),
  area_slug text not null references public.areas (slug),
  name text not null check (char_length(name) between 1 and 60),
  description text not null default '' check (char_length(description) <= 1000),
  lng double precision not null check (lng between -180 and 180),
  lat double precision not null check (lat between -90 and 90),
  geom geography(Point, 4326)
    generated always as (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  basis text not null check (basis in ('official', 'confirmed', 'no_sign')),
  instruments text[] not null default '{}' check (cardinality(instruments) <= 10),
  time_note text not null default '' check (char_length(time_note) <= 100),
  sound_note text not null default '' check (char_length(sound_note) <= 200),
  -- 「演奏できる場所だと確認した」のチェック。DB でも true 以外は受け付けない
  confirmed boolean not null check (confirmed),
  author_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  status text not null default 'public' check (status in ('public', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index places_area_idx on public.places (area_slug) where status = 'public';
create index places_geom_idx on public.places using gist (geom);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger places_touch before update on public.places
  for each row execute function public.touch_updated_at();

-- ───── 通報 ─────
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reason text not null check (reason in ('prohibited', 'noise', 'inappropriate', 'wrong', 'other')),
  note text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  unique (place_id, reporter_id) -- 同じ場所に1人1回
);

-- 通報が3件たまった場所は、自動で非表示にする
create function public.hide_reported_place() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.reports where place_id = new.place_id) >= 3 then
    update public.places set status = 'hidden' where id = new.place_id;
  end if;
  return new;
end;
$$;
create trigger reports_hide after insert on public.reports
  for each row execute function public.hide_reported_place();

-- ───── 決まり（RLS） ─────
alter table public.areas enable row level security;
alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.reports enable row level security;

-- エリア：誰でも読める（書けるのは管理画面からだけ）
create policy "areas: 誰でも読める" on public.areas for select using (true);

-- プロフィール：表示名は誰でも読める。直せるのは本人だけ
create policy "profiles: 誰でも読める" on public.profiles for select using (true);
create policy "profiles: 本人だけ直せる" on public.profiles for update
  to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- 場所：公開中は誰でも読める（自分の投稿は非表示でも見える）
create policy "places: 公開中は誰でも読める" on public.places for select
  using (status = 'public' or author_id = (select auth.uid()));
create policy "places: ログインした人が投稿できる" on public.places for insert
  to authenticated with check (author_id = (select auth.uid()));
create policy "places: 本人だけ直せる" on public.places for update
  to authenticated using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "places: 本人だけ消せる" on public.places for delete
  to authenticated using (author_id = (select auth.uid()));

-- 通報：ログインした人が登録だけできる（読めるのは管理画面からだけ）
create policy "reports: ログインした人が通報できる" on public.reports for insert
  to authenticated with check (reporter_id = (select auth.uid()));

-- ───── 列ごとの権限：status・author_id などを利用者が書き換えられないようにする ─────
revoke all on public.areas, public.profiles, public.places, public.reports from anon, authenticated;
grant select on public.areas, public.profiles, public.places to anon, authenticated;
grant update (display_name) on public.profiles to authenticated;
grant insert (area_slug, name, description, lng, lat, basis, instruments, time_note, sound_note, confirmed)
  on public.places to authenticated;
grant update (name, description, lng, lat, basis, instruments, time_note, sound_note, confirmed)
  on public.places to authenticated;
grant delete on public.places to authenticated;
grant insert (place_id, reason, note) on public.reports to authenticated;

-- トリガーの関数を API から直接呼べないようにする
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.hide_reported_place() from public, anon, authenticated;
