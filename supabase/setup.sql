-- CodeMitra Supabase Setup
-- Run this file in Supabase SQL Editor.

-- 1) Create todos table
create table if not exists public.todos (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now()
);

-- 2) Enable Row Level Security
alter table public.todos enable row level security;

-- 3) Allow read access for publishable/anon key
-- For demo and local testing only.
drop policy if exists "Allow public read access to todos" on public.todos;
create policy "Allow public read access to todos"
  on public.todos
  for select
  to anon, authenticated
  using (true);

-- 4) Seed rows (safe to run multiple times)
insert into public.todos (name)
select * from (values
  ('Learn JavaScript basics'),
  ('Fix my first bug'),
  ('Understand NameError clearly')
) as v(name)
where not exists (select 1 from public.todos t where t.name = v.name);
S