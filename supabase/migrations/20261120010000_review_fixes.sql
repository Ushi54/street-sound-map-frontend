-- Street Sound Map：レビュー係の指摘への対応（2026-11-20）
-- SQL Editor に全部貼って、1回だけ実行する

-- 1. 前からいる利用者（2025年）にもプロフィールを作る。ないと投稿・通報ができない
insert into public.profiles (id, display_name)
select id, '演奏者' || substr(replace(id::text, '-', ''), 1, 6) from auth.users
on conflict (id) do nothing;

-- 3. 通報で非表示になった投稿は、本人が消せないようにする
--    （消して投稿し直すと、通報の記録と数が消えてしまうため。消すのは管理者だけ）
drop policy "places: 本人だけ消せる" on public.places;
create policy "places: 本人だけ消せる（公開中のものだけ）" on public.places for delete
  to authenticated using (author_id = (select auth.uid()) and status = 'public');

-- 5. 楽器は決まった選択肢だけ（src/lib/types.ts の INSTRUMENTS と同じにする。片方を直したらもう片方も直す）
alter table public.places add constraint places_instruments_allowed
  check (instruments <@ array['アコースティック', '電子・小さい音', '声', '管楽器', '打楽器']::text[]);

-- 空白だけの名前を受け付けない
alter table public.profiles add constraint profiles_display_name_not_blank check (btrim(display_name) <> '');
alter table public.places add constraint places_name_not_blank check (btrim(name) <> '');

-- 6. 投稿と通報の回数に上限をつける（スクリプトでの大量投稿を防ぐ）
create function public.limit_places_per_day() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.places
      where author_id = new.author_id and created_at > now() - interval '24 hours') >= 10 then
    raise exception '投稿は1日10件までです' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger places_limit before insert on public.places
  for each row execute function public.limit_places_per_day();

create function public.limit_reports_per_day() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.reports
      where reporter_id = new.reporter_id and created_at > now() - interval '24 hours') >= 20 then
    raise exception '通報は1日20件までです' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger reports_limit before insert on public.reports
  for each row execute function public.limit_reports_per_day();

-- 11. 通報がほぼ同時に届いても、3件目で確実に非表示にする（場所の行をロックしてから数える）
create or replace function public.hide_reported_place() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.places where id = new.place_id for update;
  if (select count(*) from public.reports where place_id = new.place_id) >= 3 then
    update public.places set status = 'hidden' where id = new.place_id;
  end if;
  return new;
end;
$$;

revoke execute on function public.limit_places_per_day() from public, anon, authenticated;
revoke execute on function public.limit_reports_per_day() from public, anon, authenticated;
revoke execute on function public.hide_reported_place() from public, anon, authenticated;
