-- ====================================================================
-- MINHA PLANTINHA — SCHEMA DE DOMÍNIO & ROW LEVEL SECURITY (ETAPA 05)
-- ====================================================================

-- 1. profiles (estende auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  weather_city text default 'São Paulo, SP',
  weather_lat numeric default -23.5505,
  weather_lng numeric default -46.6333,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "select own profile" on profiles for select using (auth.uid() = id);
create policy "insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);
create policy "delete own profile" on profiles for delete using (auth.uid() = id);

-- Trigger para criar perfil automaticamente no cadastro (Etapa 04)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger no auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. plants (cada planta cadastrada)
create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text,
  cover_photo_url text,
  acquired_date date not null,
  status text not null default 'active'
    check (status in ('active','archived','deceased','gifted')),
  location text default 'indoor',
  light_level text default 'alta_indireta',
  watering_frequency_days int default 7,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table plants enable row level security;
create policy "select own plants" on plants for select using (auth.uid() = user_id);
create policy "insert own plants" on plants for insert with check (auth.uid() = user_id);
create policy "update own plants" on plants for update using (auth.uid() = user_id);
create policy "delete own plants" on plants for delete using (auth.uid() = user_id);

-- 3. diary_entries (registros do diário visual)
create table if not exists diary_entries (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  entry_time time,
  content text,
  created_at timestamptz default now()
);

alter table diary_entries enable row level security;
create policy "select own diary entries" on diary_entries for select using (auth.uid() = user_id);
create policy "insert own diary entries" on diary_entries for insert with check (auth.uid() = user_id);
create policy "update own diary entries" on diary_entries for update using (auth.uid() = user_id);
create policy "delete own diary entries" on diary_entries for delete using (auth.uid() = user_id);

-- 4. entry_photos (fotos de cada registro)
create table if not exists entry_photos (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references diary_entries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  display_order int default 0,
  caption text,
  created_at timestamptz default now()
);

alter table entry_photos enable row level security;
create policy "select own entry photos" on entry_photos for select using (auth.uid() = user_id);
create policy "insert own entry photos" on entry_photos for insert with check (auth.uid() = user_id);
create policy "update own entry photos" on entry_photos for update using (auth.uid() = user_id);
create policy "delete own entry photos" on entry_photos for delete using (auth.uid() = user_id);

-- 5. tags e entry_tags
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  unique (user_id, name)
);

alter table tags enable row level security;
create policy "select own tags" on tags for select using (auth.uid() = user_id);
create policy "insert own tags" on tags for insert with check (auth.uid() = user_id);
create policy "update own tags" on tags for update using (auth.uid() = user_id);
create policy "delete own tags" on tags for delete using (auth.uid() = user_id);

create table if not exists entry_tags (
  entry_id uuid references diary_entries(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (entry_id, tag_id)
);

alter table entry_tags enable row level security;
create policy "select own entry tags" on entry_tags for select using (
  exists (select 1 from diary_entries where id = entry_tags.entry_id and user_id = auth.uid())
);
create policy "insert own entry tags" on entry_tags for insert with check (
  exists (select 1 from diary_entries where id = entry_tags.entry_id and user_id = auth.uid())
);
create policy "delete own entry tags" on entry_tags for delete using (
  exists (select 1 from diary_entries where id = entry_tags.entry_id and user_id = auth.uid())
);

-- 6. plant_events (rega, adubação, poda, replantio, pragas, outro)
create table if not exists plant_events (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('rega','adubacao','replantio','poda','tratamento_pragas','outro')),
  event_date date not null,
  notes text,
  created_at timestamptz default now()
);

alter table plant_events enable row level security;
create policy "select own plant events" on plant_events for select using (auth.uid() = user_id);
create policy "insert own plant events" on plant_events for insert with check (auth.uid() = user_id);
create policy "update own plant events" on plant_events for update using (auth.uid() = user_id);
create policy "delete own plant events" on plant_events for delete using (auth.uid() = user_id);

-- 7. weather_alert_settings
create table if not exists weather_alert_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  rain_alert boolean default true,
  temp_swing_alert boolean default true,
  wind_alert boolean default true,
  severe_alert boolean default true,
  sensitivity text default 'media' check (sensitivity in ('baixa','media','alta')),
  quiet_hours_start time default '22:00',
  quiet_hours_end time default '07:00',
  updated_at timestamptz default now()
);

alter table weather_alert_settings enable row level security;
create policy "select own alert settings" on weather_alert_settings for select using (auth.uid() = user_id);
create policy "insert own alert settings" on weather_alert_settings for insert with check (auth.uid() = user_id);
create policy "update own alert settings" on weather_alert_settings for update using (auth.uid() = user_id);
create policy "delete own alert settings" on weather_alert_settings for delete using (auth.uid() = user_id);

-- 8. push_subscriptions
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth_key text not null,
  created_at timestamptz default now()
);

alter table push_subscriptions enable row level security;
create policy "select own push subscriptions" on push_subscriptions for select using (auth.uid() = user_id);
create policy "insert own push subscriptions" on push_subscriptions for insert with check (auth.uid() = user_id);
create policy "delete own push subscriptions" on push_subscriptions for delete using (auth.uid() = user_id);

-- 9. educational_content (conteúdo global de leitura compartilhada)
create table if not exists educational_content (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  body text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

alter table educational_content enable row level security;
create policy "read educational content" on educational_content for select to authenticated using (true);

-- ÍNDICES RECOMENDADOS (Performance & Queries Rápidas)
create index if not exists idx_plants_user_id on plants(user_id);
create index if not exists idx_diary_plant_id on diary_entries(plant_id);
create index if not exists idx_diary_entry_date on diary_entries(entry_date);
create index if not exists idx_diary_user_id on diary_entries(user_id);
create index if not exists idx_photos_entry_id on entry_photos(entry_id);
create index if not exists idx_events_plant_id on plant_events(plant_id);
create index if not exists idx_events_user_id on plant_events(user_id);
