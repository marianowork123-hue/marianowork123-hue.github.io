# Azul Marino — Joyería (tienda web)

Tienda online de joyería de lujo: catálogo, fichas de producto, buscador, carrito y
checkout de demostración. Todo el diseño y las joyas están dibujados en SVG, así que
**no hay imágenes que se puedan romper** y **no necesitas instalar ni configurar nada**.

👉 Es un sitio **100% estático**. Lo descomprimes, lo subes a GitHub y queda publicado.

---

## Publicarla en GitHub Pages (2 minutos, gratis)

1. **Crea un repositorio** nuevo en GitHub (puede ser público o privado).
2. **Sube estos archivos** a ese repositorio (arrastrándolos en *Add file → Upload files*,
   o con `git`). Importante: sube el **contenido** de esta carpeta, de modo que
   `index.html` quede en la **raíz** del repo.
3. En el repositorio ve a **Settings → Pages**.
4. En **Build and deployment → Source** elige **GitHub Actions**.
5. Listo. Cada vez que subas cambios, la web se publica sola. La verás en:
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

> El sitio ya incluye el flujo de publicación automática en
> `.github/workflows/deploy.yml`. No tienes que tocar nada.

### ¿Prefieres lo más simple posible?
También funciona con el modo clásico: **Settings → Pages → Source: Deploy from a branch →
rama `main`, carpeta `/ (root)`**. Igualmente queda online.

---

## Verla en tu computadora (opcional)

Como usa módulos cargados por internet, ábrela con un servidor local sencillo
(no con doble clic). Por ejemplo, dentro de la carpeta:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

(En GitHub Pages no hace falta nada de esto: ya se sirve por https.)

---

## ¿Qué hay dentro?

```
index.html   La página. Carga React y los íconos desde internet (CDN) y
             compila la tienda en el navegador. No requiere build.
app.jsx      Toda la tienda en un solo archivo (catálogo, carrito, checkout demo,
             y las ilustraciones de las joyas en SVG).
.github/     Publicación automática en GitHub Pages.
.nojekyll    Evita que GitHub Pages procese de más los archivos.
```

## Personalizar

Casi todo se edita al principio de **`app.jsx`**:

- **Productos**: la lista `PRODUCTS` (nombre, precio, categoría, materiales, stock…).
- **Categorías y colecciones**: `CATEGORIES` y `COLLECTIONS`.
- **Opiniones de clientes**: `TESTIMONIALS`.
- **WhatsApp**: la constante `WHATSAPP` (pon tu número con código de país, sin signos).
- **Moneda/formato**: la función `fmt`.
- **Colores y tipografías**: la constante `CSS` (más abajo en el mismo archivo).

## Nota

El pago es **simulado** (es una tienda de muestra lista para enseñar y personalizar).
Para cobrar de verdad necesitarías un servicio de pagos y un alojamiento con servidor;
esta versión está pensada para funcionar al instante en GitHub Pages sin complicaciones.
