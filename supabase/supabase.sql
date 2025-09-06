-- Enable required extensions
create extension if not exists pgcrypto;

-- Freezers (морозильные камеры)
create table freezers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null default 'Freezer',
  created_at timestamptz default now()
);

-- Shelves (полки внутри камеры)
create table shelves (
  id uuid primary key default gen_random_uuid(),
  freezer_id uuid not null references freezers(id) on delete cascade,
  index_in_freezer int not null,
  name text,
  created_at timestamptz default now()
);

-- Product catalog (популярные продукты, категории)
create table product_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  default_unit text,
  description text,
  created_at timestamptz default now()
);

-- Products (экземпляры, которые лежат на полках)
create table products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  catalog_id uuid references product_catalog(id),
  name text not null,
  quantity int not null default 1,
  unit text default 'pcs',
  shelf_id uuid references shelves(id) on delete set null,
  freezer_id uuid references freezers(id) on delete set null,
  barcode text,
  received_at timestamptz default now(),
  expiry_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for better performance
create index on products (user_id);
create index on products (shelf_id);
create index on products (expiry_date);
create index on products (freezer_id);
create index on shelves (freezer_id);
create index on freezers (user_id);

-- Enable Row Level Security
alter table freezers enable row level security;
alter table shelves enable row level security;
alter table product_catalog enable row level security;
alter table products enable row level security;

-- RLS Policies

-- Freezers: users can manage their own freezers
create policy "Freezers: users can manage their freezers" on freezers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Shelves: users can manage shelves in their freezers
create policy "Shelves: users can manage shelves in their freezers" on shelves
  for all using (exists (select 1 from freezers f where f.id = freezer_id and f.user_id = auth.uid()))
  with check (exists (select 1 from freezers f where f.id = freezer_id and f.user_id = auth.uid()));

-- Catalog: allow read for all authenticated users; no writes allowed
create policy "Catalog read for authenticated" on product_catalog
  for select using (auth.role() is not null);

-- Prevent any writes to catalog by regular users
create policy "Catalog no writes for users" on product_catalog
  for all using (false) with check (false);

-- Products: users can manage their own products
create policy "Products: users can manage their products" on products
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Function to automatically create default shelves when a freezer is created
create or replace function create_default_shelves()
returns trigger as $$
begin
  -- Create 7 default shelves
  insert into shelves (freezer_id, index_in_freezer, name)
  select
    new.id,
    generate_series(1, 7),
    'Shelf ' || generate_series(1, 7);
  return new;
end;
$$ language plpgsql;

-- Trigger to create default shelves
create trigger create_default_shelves_trigger
  after insert on freezers
  for each row
  execute function create_default_shelves();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on products
create trigger update_products_updated_at
  before update on products
  for each row
  execute function update_updated_at_column();
