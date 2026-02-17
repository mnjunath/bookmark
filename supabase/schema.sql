-- Create the bookmarks table
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  category text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
on bookmarks for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
on bookmarks for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
on bookmarks for delete
to authenticated
using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
