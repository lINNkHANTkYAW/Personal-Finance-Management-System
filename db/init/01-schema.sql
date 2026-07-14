-- Personal Finance Management System — Docker PostgreSQL schema

create extension if not exists "pgcrypto";

create table if not exists users (
  id            text primary key,
  email         text not null unique,
  name          text not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

create table if not exists accounts (
  id           text primary key,
  user_id      text not null references users(id) on delete cascade,
  name         text not null,
  type         text not null,
  balance      numeric not null default 0,
  currency     text not null default 'USD',
  last_updated timestamptz not null default now()
);

create table if not exists transactions (
  id             text primary key,
  user_id        text not null references users(id) on delete cascade,
  date           date not null,
  merchant       text not null,
  category       text not null,
  payment_method text not null,
  amount         numeric not null default 0,
  status         text not null,
  type           text not null
);

create table if not exists budgets (
  id            text primary key,
  user_id       text not null references users(id) on delete cascade,
  category      text not null,
  monthly_limit numeric not null default 0,
  spent         numeric not null default 0,
  period        text not null default 'Monthly'
);

create table if not exists savings_goals (
  id          text primary key,
  user_id     text not null references users(id) on delete cascade,
  name        text not null,
  target      numeric not null default 0,
  saved       numeric not null default 0,
  target_date date not null
);

create table if not exists investments (
  id                   text primary key,
  user_id              text not null references users(id) on delete cascade,
  name                 text not null,
  symbol               text not null,
  shares               numeric not null default 0,
  current_price        numeric not null default 0,
  today_change_percent numeric not null default 0,
  total_value          numeric not null default 0,
  total_profit_loss    numeric not null default 0,
  sparkline            numeric[] not null default '{}'
);

create table if not exists bills (
  id       text primary key,
  user_id  text not null references users(id) on delete cascade,
  name     text not null,
  amount   numeric not null default 0,
  due_date date not null,
  category text not null,
  status   text not null,
  urgency  text not null
);

create table if not exists finance_meta (
  id           text primary key,
  user_id      text not null unique references users(id) on delete cascade,
  health_score jsonb not null default '{}'::jsonb,
  db_config    jsonb not null default '{}'::jsonb
);

-- express-session / connect-pg-simple store
create table if not exists "session" (
  "sid"    varchar not null collate "default",
  "sess"   json not null,
  "expire" timestamp(6) not null
)
with (oids=false);

alter table "session" drop constraint if exists session_pkey;
alter table "session" add constraint session_pkey primary key ("sid") not deferrable initially immediate;
create index if not exists idx_session_expire on "session" ("expire");

create index if not exists idx_accounts_user on accounts (user_id);
create index if not exists idx_transactions_user on transactions (user_id);
create index if not exists idx_transactions_date on transactions (date);
create index if not exists idx_budgets_user on budgets (user_id);
create index if not exists idx_budgets_category on budgets (category);
create index if not exists idx_bills_user on bills (user_id);
create index if not exists idx_bills_due_date on bills (due_date);
create index if not exists idx_savings_goals_user on savings_goals (user_id);
create index if not exists idx_investments_user on investments (user_id);
