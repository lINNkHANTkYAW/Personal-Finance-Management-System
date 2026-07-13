-- ============================================================================
-- Personal Finance Management System — normalized Supabase schema
-- ============================================================================
-- Run this in the Supabase SQL editor (Dashboard -> SQL -> New query).
--
-- This replaces the earlier single-JSONB "finance_data" table with proper
-- normalized tables (one per entity). The app reads/writes each table with
-- real SQL queries via the Supabase client.
-- ============================================================================

-- Drop the legacy single-row table from the first schema (no longer used).
drop table if exists finance_data;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists accounts (
  id           text primary key,
  name         text not null,
  type         text not null,
  balance      numeric not null default 0,
  currency     text not null default 'USD',
  last_updated timestamptz not null default now()
);

create table if not exists transactions (
  id            text primary key,
  date          date not null,
  merchant      text not null,
  category      text not null,
  payment_method text not null,
  amount        numeric not null default 0,
  status        text not null,
  type          text not null
);

create table if not exists budgets (
  id           text primary key,
  category     text not null,
  monthly_limit numeric not null default 0,
  spent        numeric not null default 0,
  period       text not null default 'Monthly'
);

create table if not exists savings_goals (
  id          text primary key,
  name        text not null,
  target      numeric not null default 0,
  saved       numeric not null default 0,
  target_date date not null
);

create table if not exists investments (
  id                 text primary key,
  name               text not null,
  symbol             text not null,
  shares             numeric not null default 0,
  current_price      numeric not null default 0,
  today_change_percent numeric not null default 0,
  total_value        numeric not null default 0,
  total_profit_loss  numeric not null default 0,
  sparkline          numeric[] not null default '{}'
);

create table if not exists bills (
  id        text primary key,
  name      text not null,
  amount    numeric not null default 0,
  due_date  date not null,
  category  text not null,
  status    text not null,
  urgency   text not null
);

-- Singleton row (id = 'main') holding derived/non-collection state.
create table if not exists finance_meta (
  id              text primary key default 'main',
  health_score    jsonb not null default '{}'::jsonb,
  supabase_config jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Indexes (helpful once data grows)
-- ---------------------------------------------------------------------------
create index if not exists idx_transactions_date on transactions (date);
create index if not exists idx_budgets_category on budgets (category);
create index if not exists idx_bills_due_date on bills (due_date);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- The app uses the publishable (anon) key from .env.local, so the anon role
-- needs access. Enable RLS and grant the anon role full access to these tables.
alter table accounts        enable row level security;
alter table transactions    enable row level security;
alter table budgets         enable row level security;
alter table savings_goals   enable row level security;
alter table investments     enable row level security;
alter table bills           enable row level security;
alter table finance_meta    enable row level security;

do $$
declare t text;
begin
  foreach t in array array['accounts','transactions','budgets','savings_goals','investments','bills','finance_meta']
  loop
    execute format('drop policy if exists "anon full access" on %I', t);
    execute format(
      'create policy "anon full access" on %I for all to anon using (true) with check (true)',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Seed the meta singleton so the app has a row to upsert against.
-- ---------------------------------------------------------------------------
insert into finance_meta (id, health_score, supabase_config)
values ('main', '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;
