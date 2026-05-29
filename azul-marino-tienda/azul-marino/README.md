# Azul Marino Joyería — Tienda online

E-commerce de lujo construido con **Next.js 14 + TypeScript + Tailwind**, base de datos y login con **Supabase**, y pagos con **Stripe**. Incluye un **panel de administración visual** (sin código) para que el cliente gestione productos y textos.

> **¿Eres el cliente (no técnico)?** No necesitas leer este archivo. Usa el documento **“Manual de tu tienda”** que viene junto a este proyecto.
> Este README es para el desarrollador que despliega la tienda una sola vez.

---

## 1. Requisitos
- Node.js 18.18 o superior
- Una cuenta gratuita en [Supabase](https://supabase.com)
- Una cuenta en [Stripe](https://stripe.com)
- (Recomendado) Una cuenta en [Vercel](https://vercel.com) para publicar

## 2. Instalación local
```bash
npm install
cp .env.example .env.local   # luego rellena las claves (ver paso 4)
npm run dev                  # abre http://localhost:3000
```
La tienda funciona desde el primer momento con datos de ejemplo, aunque no hayas configurado Supabase ni Stripe.

## 3. Configurar Supabase (base de datos, login e imágenes)
1. Crea un proyecto en Supabase.
2. Ve a **SQL Editor → New query**, pega TODO el contenido de `supabase/schema.sql` y pulsa **Run**. Esto crea las tablas, la seguridad (RLS) y datos de ejemplo.
3. Ve a **Storage → New bucket**, crea uno **público** llamado exactamente `product-images` (ahí se guardan las fotos que sube el cliente).
4. Crea el usuario administrador: **Authentication → Users → Add user** (correo + contraseña).
5. Conviértelo en admin: en **SQL Editor** ejecuta (cambia el correo):
   ```sql
   update public.profiles set role='admin'
     where id=(select id from auth.users where email='tu-correo@ejemplo.com');
   ```
6. Copia las claves desde **Project Settings → API**: `Project URL`, `anon public` y `service_role`.

## 4. Variables de entorno (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. Configurar Stripe (pagos)
1. Copia tu `STRIPE_SECRET_KEY` (modo test) desde el dashboard de Stripe.
2. Para probar el webhook en local:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copia el `whsec_...` que te muestra y ponlo en `STRIPE_WEBHOOK_SECRET`.
3. En producción, crea el webhook en **Developers → Webhooks** apuntando a
   `https://TU-DOMINIO/api/stripe/webhook` con el evento `checkout.session.completed`.

## 6. Publicar en Vercel
1. Sube el proyecto a GitHub e impórtalo en Vercel.
2. En Vercel añade las mismas variables de entorno (cambia `NEXT_PUBLIC_SITE_URL` por tu dominio).
3. Deploy. Conecta tu dominio en **Vercel → Settings → Domains**.

## 7. Entrar al panel
`https://TU-DOMINIO/admin` → inicia sesión con el correo/contraseña del paso 3.

---

## Estructura
```
src/
  app/                  páginas (Next.js App Router)
    page.tsx            inicio
    tienda/             catálogo
    producto/[slug]/    ficha de producto (SEO dinámico)
    exito / cancelado/  resultado del pago
    api/checkout        crea el pago en Stripe
    api/stripe/webhook  confirma el pago y guarda el pedido
    admin/              PANEL (login, resumen, productos, contenido, pedidos)
  components/           Header, Footer, ProductCard, carrito, panel, ícono SVG
  lib/                  conexión a Supabase, Stripe, productos y textos
  middleware.ts         protege /admin
supabase/schema.sql     base de datos + seguridad + datos iniciales
```

## Notas / siguiente nivel (opcional)
- **Correos automáticos**: añade tu `RESEND_API_KEY` y envía el correo dentro de `api/stripe/webhook`.
- **Descuento de inventario**: amplía el webhook para restar `stock` por cada artículo.
- Las imágenes de producto se **comprimen automáticamente** en el navegador antes de subirse.
- Sin Supabase configurado, el sitio muestra contenido y productos de ejemplo (modo demostración).
