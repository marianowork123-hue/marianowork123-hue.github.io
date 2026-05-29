# Azul Marino — Joyería (tienda web)

Tienda online de joyería de lujo: catálogo, buscador, fichas de producto, carrito,
**favoritos** y **pedidos reales por WhatsApp o correo**. Acepta **fotos reales** de tus
joyas y, si no pones foto, muestra un dibujo elegante automáticamente (nunca se ve rota).

👉 Es un sitio **100% estático**: lo descomprimes, lo subes a GitHub y queda publicado.
No requiere instalar ni compilar nada.

---

## 1. Publicarla en GitHub Pages (2 minutos, gratis)

1. **Crea un repositorio** nuevo en GitHub (público o privado).
2. **Sube el contenido de esta carpeta** (arrastrándolo en *Add file → Upload files*),
   de modo que `index.html` quede en la **raíz** del repo.
3. En el repositorio ve a **Settings → Pages**.
4. En **Build and deployment → Source** elige **GitHub Actions**.
5. Listo. Cada cambio se publica solo en 1–2 minutos, en:
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

> Ya incluye el flujo de publicación automática en `.github/workflows/deploy.yml`.

---

## 2. Configurar (todo en un solo lugar)

Abre **`app.jsx`** y, casi al principio, verás un bloque **`CONFIG`**. Ahí va lo importante:

```js
const CONFIG = {
  WHATSAPP: "521234567890",       // tu número con código de país, solo números
  EMAIL_PEDIDOS: "hola@...",      // tu correo
  FORMSPREE_ID: "",               // (opcional) para recibir pedidos por correo
  MONEDA: "$",
  PAIS_MONEDA: "es-MX",
  ENVIO_GRATIS_DESDE: 1500,
  COSTO_ENVIO: 250,
  CUPON: { codigo: "AZUL10", descuento: 0.1 },
};
```

### ¿Cómo cobran / cómo te llegan los pedidos?

Esta tienda no procesa tarjetas (eso requiere un servidor). En su lugar usa el método
más fiable para un sitio estático, y **ya funciona**:

- **Por defecto (recomendado): WhatsApp.** Al pulsar *Pedir por WhatsApp*, se abre tu
  chat con el pedido escrito (productos, cantidades y total). Tú coordinas el pago.
- **Opcional: pedidos por correo (Formspree).** Crea una cuenta gratis en
  <https://formspree.io>, copia el ID de tu formulario (algo como `xyzabcd`) y pégalo en
  `FORMSPREE_ID`. A partir de ahí, el botón envía el pedido a tu correo automáticamente.
  Si fallara el envío, cae de vuelta a WhatsApp solo.

> ¿Quieres cobro con tarjeta (Stripe) en el futuro? Es un paso extra que requiere un
> pequeño servidor; tu desarrollador puede activarlo cuando lo necesites.

---

## 3. Productos y fotos

Los productos están en la lista **`PRODUCTS`** dentro de `app.jsx`. Cada joya es una
línea `P(...)`. El **último dato es la foto** (opcional):

```js
P(1, "Anillo Solitario Marea", 2480, "anillos", "ring", "#176B82",
  "Marea", "AM-RG-001", 6, "Oro 18k & topacio azul", 5, true,
  "fotos/anillo-marea.jpg")   // ← foto opcional; vacío "" = dibujo automático
```

- Sube tus fotos a la carpeta **`fotos/`** (ver `fotos/LEEME.txt`).
- Si dejas la foto vacía o pones una ruta equivocada, se muestra el **dibujo** de la joya.

---

## 4. Verla en tu computadora (opcional)

Como carga librerías desde internet, ábrela con un servidor local (no con doble clic):

```bash
python3 -m http.server 8000   # luego abre http://localhost:8000
```

(En GitHub Pages no hace falta: ya se sirve por https.)

---

## ¿Qué hay dentro?

```
index.html   La página. Carga React y los íconos desde internet y compila la tienda
             en el navegador. No requiere build.
app.jsx      Toda la tienda en un archivo: CONFIG, productos, carrito, favoritos,
             pedido por WhatsApp/correo, y los dibujos SVG de las joyas.
fotos/       Aquí pones las fotos de tus productos (opcional).
.github/     Publicación automática en GitHub Pages.
.nojekyll    Evita que GitHub Pages procese de más los archivos.
```

## Otras cosas que ya hace

- **Favoritos** (corazón) y **carrito** se recuerdan aunque cierres la página.
- **Buscador**, **filtros por categoría** y **orden** (precio, valoración, destacados).
- **Cupón** de descuento configurable (`CONFIG.CUPON`).
- Botón flotante de **WhatsApp** y enlaces de contacto.

## Personalización avanzada

- **Categorías y colecciones**: listas `CATEGORIES` y `COLLECTIONS`.
- **Opiniones de clientes**: lista `TESTIMONIALS`.
- **Colores y tipografías**: bloque `const CSS = ...` (los colores principales están
  arriba del todo, con nombres claros como `--navy`, `--gold`, `--teal`).
