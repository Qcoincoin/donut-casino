-- Run this in your Supabase SQL Editor

create table players (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  pin_hash text not null,
  balance integer not null default 0,
  created_at timestamptz default now()
);

create table deposits (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id),
  amount integer not null,
  status text not null default 'pending', -- pending | confirmed | rejected
  created_at timestamptz default now()
);

create table withdrawals (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id),
  amount integer not null,
  status text not null default 'pending', -- pending | confirmed | rejected
  created_at timestamptz default now()
);

-- Disable RLS (we use service role key from server only)
alter table players disable row level security;
alter table deposits disable row level security;
alter table withdrawals disable row level security;
