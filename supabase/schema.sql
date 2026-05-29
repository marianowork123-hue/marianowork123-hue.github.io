-- =====================================================================
-- AZUL MARINO JOYERÍA — Esquema de base de datos (Supabase / Postgres)
-- Ejecuta este archivo completo en: Supabase > SQL Editor > New query > Run
-- =====================================================================
create extension if not exists pgcrypto;

create table if not exists categories ( id text primary key, name text not null, sort int default 0 );

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, price numeric not null default 0,
  category_id text references categories(id), collection text, sku text,
  materials text, description text, stock int default 0,
  type text default 'ring', gem text default '#176B82', image_url text,
  rating int default 5, featured boolean default false, active boolean default true,
  created_at timestamptz default now()
);

create table if not exists site_content ( key text primary key, value text, updated_at timestamptz default now() );

create table if not exists banners (
  id uuid primary key default gen_random_uuid(), title text, subtitle text,
  image_url text, link text, active boolean default true, sort int default 0
);

create table if not exists coupons ( code text primary key, percent int not null, active boolean default true );

create table if not exists orders (
  id uuid primary key default gen_random_uuid(), email text, total numeric,
  status text default 'pending', stripe_session text, created_at timestamptz default now()
);
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id), name text, price numeric, qty int
);

create table if not exists profiles ( id uuid primary key references auth.users(id) on delete cascade, role text default 'customer' );

create or replace function public.handle_new_user() returns trigger as $$
begin insert into public.profiles (id, role) values (new.id,'customer') on conflict do nothing; return new; end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- ===================== SEGURIDAD (RLS) =====================
create or replace function public.is_admin() returns boolean as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin');
$$ language sql security definer;

alter table products enable row level security;
alter table categories enable row level security;
alter table site_content enable row level security;
alter table banners enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "read products" on products for select using (active = true);
create policy "read cats" on categories for select using (true);
create policy "read content" on site_content for select using (true);
create policy "read banners" on banners for select using (active = true);
create policy "read coupons" on coupons for select using (active = true);

create policy "admin products" on products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin cats" on categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin content" on site_content for all using (public.is_admin()) with check (public.is_admin());
create policy "admin banners" on banners for all using (public.is_admin()) with check (public.is_admin());
create policy "admin coupons" on coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin orders" on orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admin oitems" on order_items for all using (public.is_admin()) with check (public.is_admin());

-- ===================== DATOS INICIALES =====================
insert into categories (id,name,sort) values
 ('anillos','Anillos',1),('collares','Collares',2),('aretes','Aretes',3),('pulseras','Pulseras',4)
on conflict (id) do nothing;

insert into site_content (key,value) values
 ('announcement','Envío gratis en pedidos superiores a $1,500 · Piezas hechas a mano · Garantía de por vida'),
 ('hero_eyebrow','Joyería de autor · Hecha a mano'),
 ('hero_title','El mar y la luz,\nen cada pieza.'),
 ('hero_subtitle','Oro de 18 quilates y gemas seleccionadas a mano. Joyas pensadas para durar generaciones, no temporadas.'),
 ('about_title','Hecho a mano, hecho para durar'),
 ('about_text','Azul Marino nace del oficio de la orfebreria tradicional y la obsesion por el detalle. Cada pieza se disena, funde y pule a mano en nuestro taller.'),
 ('newsletter_title','Se el primero en ver cada coleccion'),
 ('footer_tagline','Joyeria de autor hecha a mano. Oro 18k y gemas de origen responsable.'),
 ('whatsapp','521234567890')
on conflict (key) do nothing;

insert into coupons (code,percent) values ('AZUL10',10) on conflict (code) do nothing;

insert into products (slug,name,price,category_id,collection,sku,materials,description,stock,type,gem,featured) values
 ('anillo-solitario-marea','Anillo Solitario Marea',2480,'anillos','Marea','AM-RG-001','Oro 18k & topacio azul','Pieza de la coleccion Marea, hecha a mano.',6,'ring','#176B82',true),
 ('collar-gota-de-mar','Collar Gota de Mar',3190,'collares','Marea','AM-NK-002','Oro 18k & aguamarina','Pieza de la coleccion Marea, hecha a mano.',4,'necklace','#176B82',true),
 ('aretes-solsticio','Aretes Solsticio',1890,'aretes','Solsticio','AM-ER-003','Oro 18k & citrino','Pieza de la coleccion Solsticio.',9,'earrings','#C99A2E',true),
 ('pulsera-abismo','Pulsera Abismo',2750,'pulseras','Abismo','AM-BR-004','Oro blanco & zafiro','Pieza de la coleccion Abismo.',5,'bracelet','#0E2A3A',true)
on conflict (slug) do nothing;

-- ===== CÓMO HACERTE ADMINISTRADOR =====
-- 1) Authentication > Users > Add user (correo + contraseña)
-- 2) Ejecuta (cambia el correo):
-- update public.profiles set role='admin' where id=(select id from auth.users where email='tu-correo@ejemplo.com');

-- ===== IMÁGENES ===== Storage > New bucket PÚBLICO llamado:  product-images
