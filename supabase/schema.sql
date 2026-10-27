-- Run this whole file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'Live Events',
  description text not null default '',
  affiliate_url text not null,
  image_url text,
  button_text text not null default 'Explore Event →',
  seo_title text,
  meta_description text,
  keywords text,
  canonical_url text,
  og_image text,
  robots text not null default 'index, follow',
  status text not null default 'published' check (status in ('published','draft')),
  display_order integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  seo_title text not null default 'Softrix IT Tech | Live Events & Entertainment',
  meta_description text not null default 'Discover live sports, festivals and entertainment experiences with Softrix IT Tech.',
  keywords text not null default 'live events, sports, festivals, entertainment',
  canonical_url text,
  robots text not null default 'index, follow',
  og_image text,
  hero_heading text not null default 'Big events.',
  hero_highlight text not null default 'Bigger moments.',
  hero_description text not null default 'Discover college football, music festivals, global sports and live entertainment.',
  affiliate_disclosure text not null default 'Some links may be affiliate links.'
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.events enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events" on public.events for select using (status = 'published' or auth.uid() is not null);
drop policy if exists "Authenticated admins manage events" on public.events;
create policy "Authenticated admins manage events" on public.events for all to authenticated using (true) with check (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings" on public.site_settings for select using (true);
drop policy if exists "Authenticated admins update site settings" on public.site_settings;
create policy "Authenticated admins update site settings" on public.site_settings for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images','event-images',true,5242880,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true;

drop policy if exists "Public can view event images" on storage.objects;
create policy "Public can view event images" on storage.objects for select using (bucket_id = 'event-images');
drop policy if exists "Authenticated admins upload event images" on storage.objects;
create policy "Authenticated admins upload event images" on storage.objects for insert to authenticated with check (bucket_id = 'event-images');
drop policy if exists "Authenticated admins update event images" on storage.objects;
create policy "Authenticated admins update event images" on storage.objects for update to authenticated using (bucket_id = 'event-images') with check (bucket_id = 'event-images');
drop policy if exists "Authenticated admins delete event images" on storage.objects;
create policy "Authenticated admins delete event images" on storage.objects for delete to authenticated using (bucket_id = 'event-images');

-- Seed the five affiliate campaigns supplied by the site owner.
insert into public.events (name,slug,category,description,affiliate_url,button_text,seo_title,meta_description,keywords,display_order,status)
values
('NCAA College Football','ncaa-college-football','Sports','Get ready for college football action, key matchups and game-day moments.','https://allflixes.com/campaign-visit/ilauyvllauyvqlzc','Explore Event →','NCAA College Football | Softrix IT Tech','Discover NCAA college football events, matchups and game-day experiences.','NCAA College Football, college football, football events, live sports',1,'published'),
('Festival','festival','Festival','Discover festival highlights, live performances and entertainment experiences.','https://allflixes.com/campaign-visit/3ef3d93ef3d9qlzc','Explore Festival →','Festival Events & Live Music | Softrix IT Tech','Explore festival events, live music and entertainment experiences.','festival, music festival, live music, festival events',2,'published'),
('Singapore IVF Va’a World Sprint Championships','singapore-ivf-vaa-world-sprint-championships','Sports','Explore event information for the Singapore IVF Va’a World Sprint Championships.','https://allflixes.com/campaign-visit/jeeqftjeeqftqlzc','View Event →','Singapore IVF Va’a World Sprint Championships | Softrix IT Tech','Discover information about the Singapore IVF Va’a World Sprint Championships.','Singapore, Va’a, World Sprint Championships, sports',3,'published'),
('All Sports','all-sports','Sports','Explore sporting events and live-action experiences across different sports.','https://allflixes.com/campaign-visit/cbvmqjcbvmqjqlzc','Explore Sports →','All Sports Events | Softrix IT Tech','Explore sports events and live-action experiences with Softrix IT Tech.','sports, live sports, sports events, competitions',4,'published'),
('Live Events','live-events','Live Events','Find live entertainment, special broadcasts and memorable events.','https://allflixes.com/campaign-visit/ty4bqyty4bqyqlzc','Explore Live Events →','Live Events & Entertainment | Softrix IT Tech','Discover live events, entertainment and special experiences.','live events, entertainment, live shows, events',5,'published')
on conflict (slug) do nothing;
