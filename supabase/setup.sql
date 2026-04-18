-- CodeMitra Supabase Setup
-- Run this file in Supabase SQL Editor.

-- 1) Create todos table
create table if not exists public.todos (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) Enable Row Level Security
alter table public.todos enable row level security;

-- 3) RLS policies for authenticated users
drop policy if exists "Todos select own rows" on public.todos;
create policy "Todos select own rows"
  on public.todos
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Todos insert own rows" on public.todos;
create policy "Todos insert own rows"
  on public.todos
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Todos update own rows" on public.todos;
create policy "Todos update own rows"
  on public.todos
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Todos delete own rows" on public.todos;
create policy "Todos delete own rows"
  on public.todos
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- 4) Optional demo seed data for a temporary public/demo setup.
-- If you want auth-based rows only, comment this block out.
insert into public.todos (user_id, title, is_done)
select null, v.title, false
from (values
  ('Learn JavaScript basics'),
  ('Fix my first bug'),
  ('Understand NameError clearly')
) as v(title)
where not exists (select 1 from public.todos t where t.title = v.title);