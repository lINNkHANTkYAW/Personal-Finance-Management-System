-- Personal Finance Management System — Docker PostgreSQL schema

create table if not exists accounts (
  id           text primary key,
  name         text not null,
  type         text not null,
  balance      numeric not null default 0,
  currency     text not null default 'USD',
  last_updated timestamptz not null default now()
);

create table if not exists transactions (
  id             text primary key,
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
  category      text not null,
  monthly_limit numeric not null default 0,
  spent         numeric not null default 0,
  period        text not null default 'Monthly'
);

create table if not exists savings_goals (
  id          text primary key,
  name        text not null,
  target      numeric not null default 0,
  saved       numeric not null default 0,
  target_date date not null
);

create table if not exists investments (
  id                   text primary key,
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
  name     text not null,
  amount   numeric not null default 0,
  due_date date not null,
  category text not null,
  status   text not null,
  urgency  text not null
);

create table if not exists finance_meta (
  id         text primary key default 'main',
  health_score jsonb not null default '{}'::jsonb,
  db_config    jsonb not null default '{}'::jsonb
);

create index if not exists idx_transactions_date on transactions (date);
create index if not exists idx_budgets_category on budgets (category);
create index if not exists idx_bills_due_date on bills (due_date);

insert into finance_meta (id, health_score, db_config)
values ('main', '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;
