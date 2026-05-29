import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, ShoppingBag, Heart, User, Menu, X, Plus, Minus, Star,
  Truck, ShieldCheck, Gem, Instagram, ArrowRight, ArrowLeft, Check,
  Trash2, Mail, MessageCircle, ChevronDown, Sparkles
} from "lucide-react";

/* ============================== DATA ============================== */
const CATEGORIES = [
  { id: "anillos", name: "Anillos" },
  { id: "collares", name: "Collares" },
  { id: "aretes", name: "Aretes" },
  { id: "pulseras", name: "Pulseras" },
];

const COLLECTIONS = [
  { id: "marea", name: "Marea", tag: "Inspirada en el oleaje", gem: "#176B82" },
  { id: "solsticio", name: "Solsticio", tag: "Oro y luz cálida", gem: "#C99A2E" },
  { id: "abismo", name: "Abismo", tag: "Profundidad y misterio", gem: "#0E2A3A" },
];

const P = (id, name, price, category, type, gem, collection, sku, stock, materials, rating, featured) =>
  ({ id, name, price, category, type, gem, collection, sku, stock, materials, rating, featured,
     slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
     desc: `Pieza ${materials.toLowerCase()} de la colección ${collection}. Acabado a mano por nuestros orfebres, pensada para acompañarte toda la vida.` });

const PRODUCTS = [
  P(1, "Anillo Solitario Marea", 2480, "anillos", "ring", "#176B82", "Marea", "AM-RG-001", 6, "Oro 18k & topacio azul", 5, true),
  P(2, "Collar Gota de Mar", 3190, "collares", "necklace", "#176B82", "Marea", "AM-NK-002", 4, "Oro 18k & aguamarina", 5, true),
  P(3, "Aretes Solsticio", 1890, "aretes", "earrings", "#C99A2E", "Solsticio", "AM-ER-003", 9, "Oro 18k & citrino", 4, true),
  P(4, "Pulsera Abismo", 2750, "pulseras", "bracelet", "#0E2A3A", "Abismo", "AM-BR-004", 5, "Oro blanco & zafiro", 5, true),
  P(5, "Anillo Eclipse", 2950, "anillos", "ring", "#0E2A3A", "Abismo", "AM-RG-005", 3, "Oro blanco & zafiro", 5, false),
  P(6, "Collar Hilo de Luz", 2390, "collares", "necklace", "#C99A2E", "Solsticio", "AM-NK-006", 7, "Oro 18k & diamante", 4, true),
  P(7, "Aretes Marea Baja", 1650, "aretes", "earrings", "#176B82", "Marea", "AM-ER-007", 12, "Oro 18k & topacio", 4, false),
  P(8, "Pulsera Solsticio", 2090, "pulseras", "bracelet", "#C99A2E", "Solsticio", "AM-BR-008", 8, "Oro 18k & citrino", 5, false),
  P(9, "Anillo Profundidad", 3380, "anillos", "ring", "#0E2A3A", "Abismo", "AM-RG-009", 2, "Oro blanco & zafiro azul", 5, false),
  P(10, "Collar Constelación", 4120, "collares", "necklace", "#0E2A3A", "Abismo", "AM-NK-010", 3, "Oro blanco & diamantes", 5, true),
  P(11, "Aretes Reflejo", 1990, "aretes", "earrings", "#176B82", "Marea", "AM-ER-011", 6, "Oro 18k & aguamarina", 4, false),
  P(12, "Pulsera Amanecer", 2280, "pulseras", "bracelet", "#C99A2E", "Solsticio", "AM-BR-012", 5, "Oro 18k & topacio dorado", 4, false),
];

const TESTIMONIALS = [
  { t: "La calidad superó por completo mis expectativas. Se siente como una pieza heredada.", a: "Valentina R.", c: "Anillo Solitario Marea" },
  { t: "El empaque, el detalle, el brillo… todo impecable. Mi collar favorito.", a: "Daniela M.", c: "Collar Gota de Mar" },
  { t: "Compré los aretes para mi madre y lloró. Eso lo dice todo.", a: "Andrés P.", c: "Aretes Solsticio" },
];

const fmt = (n) => "$" + n.toLocaleString("es-MX");
const WHATSAPP = "521234567890";

/* ============================== ILLUSTRATIONS ============================== */
function Facets({ cx, cy, r, gem }) {
  const dark = "rgba(0,0,0,.28)", light = "rgba(255,255,255,.55)";
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={gem} />
      <path d={`M${cx - r} ${cy} L${cx} ${cy - r} L${cx + r} ${cy} L${cx} ${cy + r} Z`} fill="none" stroke={light} strokeWidth="1" opacity=".7" />
      <path d={`M${cx} ${cy - r} L${cx} ${cy + r}`} stroke={dark} strokeWidth="1" opacity=".5" />
      <path d={`M${cx - r} ${cy} L${cx + r} ${cy}`} stroke={dark} strokeWidth="1" opacity=".5" />
      <circle cx={cx - r * 0.32} cy={cy - r * 0.32} r={r * 0.18} fill={light} opacity=".9" />
    </g>
  );
}
const GOLD = "#C99A2E", GOLD_D = "#A87E1E";
function Jewel({ type, gem, size = 220 }) {
  const common = { width: "100%", height: "100%", viewBox: "0 0 220 220", style: { display: "block" } };
  if (type === "ring")
    return (
      <svg {...common}>
        <ellipse cx="110" cy="150" rx="52" ry="54" fill="none" stroke={GOLD} strokeWidth="9" />
        <ellipse cx="110" cy="150" rx="52" ry="54" fill="none" stroke={GOLD_D} strokeWidth="1.5" opacity=".5" />
        <path d="M86 96 L110 60 L134 96 L110 116 Z" fill={gem} />
        <path d="M86 96 L134 96" stroke="rgba(255,255,255,.6)" strokeWidth="1" />
        <path d="M110 60 L110 116 M86 96 L110 80 L134 96" stroke="rgba(0,0,0,.25)" strokeWidth="1" fill="none" />
        <path d="M93 96 L110 60 M127 96 L110 60" stroke="rgba(255,255,255,.45)" strokeWidth="1" />
      </svg>
    );
  if (type === "necklace")
    return (
      <svg {...common}>
        <path d="M40 56 Q110 150 180 56" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path d="M40 56 Q110 150 180 56" fill="none" stroke={GOLD} strokeWidth="3" strokeDasharray="1 5" strokeLinecap="round" opacity=".0" />
        <line x1="110" y1="128" x2="110" y2="146" stroke={GOLD} strokeWidth="3" />
        <Facets cx={110} cy={168} r={26} gem={gem} />
        <circle cx="110" cy="168" r="26" fill="none" stroke={GOLD} strokeWidth="3" />
      </svg>
    );
  if (type === "earrings")
    return (
      <svg {...common}>
        {[78, 142].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 58 a14 14 0 1 0 0.1 0`} fill="none" stroke={GOLD} strokeWidth="3" />
            <line x1={x} y1="72" x2={x} y2="96" stroke={GOLD} strokeWidth="2.5" />
            <path d={`M${x - 18} 116 L${x} 96 L${x + 18} 116 L${x} 150 Z`} fill={gem} />
            <path d={`M${x - 18} 116 L${x + 18} 116 M${x} 96 L${x} 150`} stroke="rgba(255,255,255,.5)" strokeWidth="1" />
            <path d={`M${x} 96 L${x - 18} 116 M${x} 96 L${x + 18} 116`} stroke="rgba(255,255,255,.4)" strokeWidth="1" />
          </g>
        ))}
      </svg>
    );
  return (
    <svg {...common}>
      <ellipse cx="110" cy="118" rx="74" ry="58" fill="none" stroke={GOLD} strokeWidth="8" />
      <ellipse cx="110" cy="118" rx="74" ry="58" fill="none" stroke={GOLD_D} strokeWidth="1.5" opacity=".5" />
      {[-1, 0, 1].map((k) => <Facets key={k} cx={110 + k * 44} cy={62} r={13} gem={gem} />)}
    </svg>
  );
}

/* ============================== HOOKS ============================== */
function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, seen] = useReveal();
  return (
    <div ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ============================== CARD ============================== */
function ProductCard({ p, onOpen, onAdd, onWish, wished }) {
  return (
    <article className="card" onClick={() => onOpen(p)}>
      <div className="card-media">
        <span className="card-collection">{p.collection}</span>
        <button className={`wish ${wished ? "on" : ""}`} aria-label="Favorito"
          onClick={(e) => { e.stopPropagation(); onWish(p); }}>
          <Heart size={16} fill={wished ? "#176B82" : "none"} />
        </button>
        <div className="jewel-wrap"><Jewel type={p.type} gem={p.gem} /></div>
        <button className="quick" onClick={(e) => { e.stopPropagation(); onAdd(p); }}>
          Añadir al carrito
        </button>
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted small">{p.materials}</p>
        <div className="card-foot">
          <span className="price">{fmt(p.price)}</span>
          <span className="stars">{Array.from({ length: 5 }).map((_, i) =>
            <Star key={i} size={12} fill={i < p.rating ? GOLD : "none"} stroke={i < p.rating ? GOLD : "#cbb98a"} />)}</span>
        </div>
      </div>
    </article>
  );
}

/* ============================== APP ============================== */
export default function App() {
  const [route, setRoute] = useState("home");
  const [active, setActive] = useState(null);
  const [cat, setCat] = useState("todos");
  const [sort, setSort] = useState("destacados");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [toast, setToast] = useState("");
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(0);

  const flash = (m) => { setToast(m); window.clearTimeout(window.__t); window.__t = setTimeout(() => setToast(""), 2200); };

  const open = (p) => { setActive(p); setRoute("product"); setQty(1); setVariant(0); window.scrollTo({ top: 0, behavior: "instant" }); };
  const home = () => { setRoute("home"); setActive(null); };

  const add = (p, n = 1) => {
    setCart((c) => {
      const f = c.find((i) => i.id === p.id);
      return f ? c.map((i) => i.id === p.id ? { ...i, qty: i.qty + n } : i) : [...c, { ...p, qty: n }];
    });
    flash(`${p.name} · añadido`);
  };
  const dec = (id) => setCart((c) => c.flatMap((i) => i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]));
  const remove = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const toggleWish = (p) => setWish((w) => w.find((i) => i.id === p.id) ? w.filter((i) => i.id !== p.id) : [...w, p]);
  const isWished = (id) => wish.some((i) => i.id === id);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = applied ? Math.round(subtotal * applied) : 0;
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 250;
  const total = subtotal - discount + shipping;
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "AZUL10") { setApplied(0.1); flash("Cupón AZUL10 aplicado · 10%"); }
    else { setApplied(null); flash("Cupón no válido"); }
  };

  const list = useMemo(() => {
    let r = PRODUCTS.filter((p) =>
      (cat === "todos" || p.category === cat) &&
      (q === "" || (p.name + p.materials + p.collection).toLowerCase().includes(q.toLowerCase())));
    if (sort === "precio-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "destacados") r = [...r].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return r;
  }, [cat, sort, q]);

  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const related = active ? PRODUCTS.filter((p) => p.category === active.category && p.id !== active.id).slice(0, 3) : [];

  const goShop = (c) => { setCat(c); home(); setMenuOpen(false); setTimeout(() => document.getElementById("tienda")?.scrollIntoView({ behavior: "smooth" }), 60); };

  useEffect(() => { document.body.style.overflow = (cartOpen || wishOpen || searchOpen || menuOpen) ? "hidden" : ""; }, [cartOpen, wishOpen, searchOpen, menuOpen]);

  return (
    <div className="am">
      <style>{CSS}</style>

      {/* announcement */}
      <div className="bar">Envío gratis en pedidos superiores a {fmt(1500)} · Piezas hechas a mano · Garantía de por vida</div>

      {/* header */}
      <header className="hdr">
        <button className="icn only-m" onClick={() => setMenuOpen(true)} aria-label="Menú"><Menu size={20} /></button>
        <nav className="nav only-d">
          <a onClick={() => goShop("todos")}>Tienda</a>
          <a onClick={() => goShop("anillos")}>Anillos</a>
          <a onClick={() => goShop("collares")}>Collares</a>
          <a onClick={() => goShop("aretes")}>Aretes</a>
        </nav>
        <button className="brand" onClick={home} aria-label="Azul Marino — Inicio">
          <svg width="34" height="26" viewBox="0 0 60 46" aria-hidden>
            <path d="M14 12 L30 4 L46 12 L46 14 L30 30 L14 14 Z" fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" />
            <path d="M22 12 L30 4 L38 12 L30 18 Z" fill="#176B82" />
          </svg>
          <span className="wordmark">AZUL MARINO</span>
        </button>
        <div className="actions">
          <button className="icn" onClick={() => setSearchOpen(true)} aria-label="Buscar"><Search size={19} /></button>
          <button className="icn only-d" aria-label="Cuenta"><User size={19} /></button>
          <button className="icn" onClick={() => setWishOpen(true)} aria-label="Favoritos">
            <Heart size={19} />{wish.length > 0 && <i className="dot">{wish.length}</i>}
          </button>
          <button className="icn" onClick={() => setCartOpen(true)} aria-label="Carrito">
            <ShoppingBag size={19} />{count > 0 && <i className="dot">{count}</i>}
          </button>
        </div>
      </header>

      {route === "home" ? (
        <main>
          {/* HERO */}
          <section className="hero">
            <div className="hero-grain" />
            <div className="hero-glow" />
            <div className="hero-inner">
              <Reveal><span className="eyebrow">Joyería de autor · Hecha a mano</span></Reveal>
              <Reveal delay={120}><h1>El mar y la luz,<br /><em>en cada pieza.</em></h1></Reveal>
              <Reveal delay={240}><p className="lead">Oro de 18 quilates y gemas seleccionadas a mano. Joyas pensadas para durar generaciones, no temporadas.</p></Reveal>
              <Reveal delay={360} className="hero-cta">
                <button className="btn" onClick={() => goShop("todos")}>Explorar la colección <ArrowRight size={16} /></button>
                <button className="btn ghost" onClick={() => goShop("anillos")}>Ver anillos</button>
              </Reveal>
            </div>
            <div className="hero-art">
              <div className="hero-jewel"><Jewel type="necklace" gem="#176B82" /></div>
            </div>
          </section>

          {/* TRUST */}
          <section className="trust">
            {[[Truck, "Envío asegurado", "Gratis desde " + fmt(1500)],
              [ShieldCheck, "Garantía de por vida", "Mantenimiento incluido"],
              [Gem, "Hecho a mano", "Por orfebres locales"],
              [Sparkles, "Pago seguro", "Cifrado de extremo a extremo"]].map(([I, t, s], i) => (
              <Reveal key={i} delay={i * 80} className="trust-i"><I size={20} /><div><strong>{t}</strong><span>{s}</span></div></Reveal>
            ))}
          </section>

          {/* COLLECTIONS */}
          <section className="sec">
            <Reveal className="sec-head">
              <span className="kicker">Colecciones</span>
              <h2>Tres formas de brillar</h2>
            </Reveal>
            <div className="coll-grid">
              {COLLECTIONS.map((c, i) => (
                <Reveal key={c.id} delay={i * 90}>
                  <button className="coll" style={{ "--g": c.gem }} onClick={() => { setQ(c.name); goShop("todos"); }}>
                    <div className="coll-orb" />
                    <h3>{c.name}</h3>
                    <p>{c.tag}</p>
                    <span className="link">Descubrir <ArrowRight size={14} /></span>
                  </button>
                </Reveal>
              ))}
            </div>
          </section>

          {/* FEATURED */}
          <section className="sec">
            <Reveal className="sec-head row">
              <div><span className="kicker">Destacados</span><h2>Favoritos de la casa</h2></div>
              <button className="link big" onClick={() => goShop("todos")}>Ver todo <ArrowRight size={15} /></button>
            </Reveal>
            <div className="grid">
              {featured.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <ProductCard p={p} onOpen={open} onAdd={add} onWish={toggleWish} wished={isWished(p.id)} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* CATEGORIES */}
          <section className="sec cats">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <button className="cat" onClick={() => goShop(c.id)}>
                  <Jewel type={c.id === "anillos" ? "ring" : c.id === "collares" ? "necklace" : c.id === "aretes" ? "earrings" : "bracelet"} gem="#176B82" />
                  <span>{c.name}</span>
                </button>
              </Reveal>
            ))}
          </section>

          {/* SHOP */}
          <section className="sec" id="tienda">
            <Reveal className="sec-head"><span className="kicker">Tienda</span><h2>Catálogo completo</h2></Reveal>
            <div className="toolbar">
              <div className="chips">
                {[{ id: "todos", name: "Todo" }, ...CATEGORIES].map((c) => (
                  <button key={c.id} className={`chip ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)}>{c.name}</button>
                ))}
              </div>
              <div className="sortbox">
                <label>Ordenar</label>
                <div className="select">
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="destacados">Destacados</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="rating">Mejor valorados</option>
                  </select>
                  <ChevronDown size={15} />
                </div>
              </div>
            </div>
            {q && <p className="muted small filter-note">Filtrando por “{q}” · <button className="link" onClick={() => setQ("")}>limpiar</button></p>}
            <div className="grid">
              {list.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 60}>
                  <ProductCard p={p} onOpen={open} onAdd={add} onWish={toggleWish} wished={isWished(p.id)} />
                </Reveal>
              ))}
            </div>
            {list.length === 0 && <p className="empty">No encontramos piezas con esos filtros.</p>}
          </section>

          {/* EDITORIAL */}
          <section className="editorial">
            <Reveal className="edi-art"><div className="edi-jewel"><Jewel type="ring" gem="#C99A2E" /></div></Reveal>
            <Reveal delay={120} className="edi-txt">
              <span className="kicker">Nosotros</span>
              <h2>Hecho a mano, hecho para durar</h2>
              <p>Azul Marino nace del oficio de la orfebrería tradicional y la obsesión por el detalle. Cada pieza se diseña, funde y pule a mano en nuestro taller, usando oro certificado y gemas de origen responsable.</p>
              <p>No seguimos tendencias: creamos joyas que se vuelven herencia.</p>
              <button className="btn ghost" onClick={() => goShop("todos")}>Conocer las piezas</button>
            </Reveal>
          </section>

          {/* TESTIMONIALS */}
          <section className="sec testi">
            <Reveal className="sec-head center"><span className="kicker">Testimonios</span><h2>Lo que dicen quienes nos eligen</h2></Reveal>
            <div className="testi-grid">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={i} delay={i * 90} className="quote">
                  <div className="stars">{Array.from({ length: 5 }).map((_, k) => <Star key={k} size={14} fill={GOLD} stroke={GOLD} />)}</div>
                  <p>“{t.t}”</p>
                  <div className="quote-by"><strong>{t.a}</strong><span>{t.c}</span></div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className="news">
            <Reveal>
              <span className="kicker light">Newsletter</span>
              <h2>Sé el primero en ver cada colección</h2>
              <p>Acceso anticipado, ediciones limitadas y un 10% en tu primera compra.</p>
              <div className="news-form">
                <input placeholder="tu@correo.com" aria-label="Correo" />
                <button className="btn" onClick={() => flash("¡Gracias por suscribirte!")}>Suscribirme</button>
              </div>
              <small>Sin spam. Cancela cuando quieras.</small>
            </Reveal>
          </section>

          {/* INSTAGRAM */}
          <section className="sec ig">
            <Reveal className="sec-head center"><span className="kicker">@azulmarino</span><h2>Síguenos en Instagram</h2></Reveal>
            <div className="ig-grid">
              {PRODUCTS.slice(0, 6).map((p) => (
                <button key={p.id} className="ig-tile" onClick={() => open(p)}>
                  <Jewel type={p.type} gem={p.gem} />
                  <span className="ig-ov"><Instagram size={18} /></span>
                </button>
              ))}
            </div>
          </section>
        </main>
      ) : (
        /* ===================== PRODUCT PAGE ===================== */
        <main className="pdp">
          <button className="back" onClick={home}><ArrowLeft size={16} /> Volver</button>
          <div className="pdp-grid">
            <div className="pdp-gallery">
              <div className="pdp-main"><Jewel type={active.type} gem={active.gem} size={420} /></div>
              <div className="pdp-thumbs">
                {[active.gem, "#C99A2E", "#0E2A3A"].map((g, i) => (
                  <button key={i} className={`thumb ${variant === i ? "on" : ""}`} onClick={() => setVariant(i)}>
                    <Jewel type={active.type} gem={g} />
                  </button>
                ))}
              </div>
            </div>
            <div className="pdp-info">
              <span className="kicker">{active.collection}</span>
              <h1>{active.name}</h1>
              <div className="pdp-meta">
                <span className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < active.rating ? GOLD : "none"} stroke={GOLD} />)}</span>
                <span className="muted small">SKU {active.sku}</span>
              </div>
              <div className="pdp-price">{fmt(active.price)}</div>
              <p className="pdp-desc">{active.desc}</p>

              <div className="pdp-opt">
                <label>Metal</label>
                <div className="opts">
                  {["Oro 18k", "Oro blanco", "Oro rosa"].map((m, i) => (
                    <button key={m} className={`opt ${variant === i ? "on" : ""}`} onClick={() => setVariant(i)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="pdp-buy">
                <div className="qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={15} /></button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}><Plus size={15} /></button>
                </div>
                <button className="btn block" onClick={() => { add(active, qty); setCartOpen(true); }}>Añadir al carrito · {fmt(active.price * qty)}</button>
              </div>
              <div className="pdp-actions">
                <button className="link" onClick={() => toggleWish(active)}>
                  <Heart size={15} fill={isWished(active.id) ? "#176B82" : "none"} /> {isWished(active.id) ? "En favoritos" : "Añadir a favoritos"}
                </button>
                <a className="link" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, me interesa " + active.name)}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={15} /> Consultar por WhatsApp
                </a>
              </div>

              <div className="pdp-feats">
                <span className={active.stock <= 3 ? "low" : "ok"}><Check size={14} /> {active.stock <= 3 ? `Solo ${active.stock} disponibles` : "En stock"}</span>
                <span><Truck size={14} /> Envío gratis</span>
                <span><ShieldCheck size={14} /> Garantía de por vida</span>
                <span><Gem size={14} /> {active.materials}</span>
              </div>
            </div>
          </div>

          <section className="sec">
            <div className="sec-head"><span className="kicker">También te puede gustar</span><h2>Piezas relacionadas</h2></div>
            <div className="grid">
              {related.map((p) => <ProductCard key={p.id} p={p} onOpen={open} onAdd={add} onWish={toggleWish} wished={isWished(p.id)} />)}
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="ftr">
        <div className="ftr-top">
          <div className="ftr-brand">
            <div className="brand"><svg width="30" height="22" viewBox="0 0 60 46"><path d="M14 12 L30 4 L46 12 L46 14 L30 30 L14 14 Z" fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" /><path d="M22 12 L30 4 L38 12 L30 18 Z" fill="#176B82" /></svg><span className="wordmark">AZUL MARINO</span></div>
            <p className="muted">Joyería de autor hecha a mano. Oro 18k y gemas de origen responsable.</p>
            <div className="ftr-social"><a href="#"><Instagram size={18} /></a><a href={`https://wa.me/${WHATSAPP}`}><MessageCircle size={18} /></a><a href="#"><Mail size={18} /></a></div>
          </div>
          <div className="ftr-col"><h4>Tienda</h4>{CATEGORIES.map((c) => <a key={c.id} onClick={() => goShop(c.id)}>{c.name}</a>)}<a onClick={() => goShop("todos")}>Todas las piezas</a></div>
          <div className="ftr-col"><h4>Ayuda</h4><a href="#">Contacto</a><a href="#">Preguntas frecuentes</a><a href="#">Guía de tallas</a><a href="#">Cuidado de joyas</a></div>
          <div className="ftr-col"><h4>Legal</h4><a href="#">Política de privacidad</a><a href="#">Términos y condiciones</a><a href="#">Política de envíos</a><a href="#">Devoluciones</a></div>
        </div>
        <div className="ftr-bottom"><span>© {new Date().getFullYear()} Azul Marino Joyería · Hecho con oficio.</span><span>Pagos seguros con tarjeta</span></div>
      </footer>

      {/* ===================== OVERLAYS ===================== */}
      {(cartOpen || wishOpen) && <div className="scrim" onClick={() => { setCartOpen(false); setWishOpen(false); }} />}

      {/* CART */}
      <aside className={`drawer ${cartOpen ? "open" : ""}`}>
        <div className="drawer-h"><h3>Tu carrito ({count})</h3><button className="icn" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
        <div className="drawer-b">
          {cart.length === 0 ? <p className="empty sm">Tu carrito está vacío.</p> : cart.map((i) => (
            <div className="line" key={i.id}>
              <div className="line-img"><Jewel type={i.type} gem={i.gem} /></div>
              <div className="line-info">
                <strong>{i.name}</strong><span className="muted small">{i.materials}</span>
                <div className="line-qty">
                  <button onClick={() => dec(i.id)}><Minus size={13} /></button><span>{i.qty}</span>
                  <button onClick={() => add(i, 1)}><Plus size={13} /></button>
                  <button className="rm" onClick={() => remove(i.id)}><Trash2 size={14} /></button>
                </div>
              </div>
              <span className="price sm">{fmt(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="drawer-f">
            <div className="coupon">
              <input placeholder="Código (prueba AZUL10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button onClick={applyCoupon}>Aplicar</button>
            </div>
            <div className="totals">
              <div><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {discount > 0 && <div className="disc"><span>Descuento</span><span>−{fmt(discount)}</span></div>}
              <div><span>Envío</span><span>{shipping === 0 ? "Gratis" : fmt(shipping)}</span></div>
              <div className="grand"><span>Total</span><span>{fmt(total)}</span></div>
            </div>
            <button className="btn block" onClick={() => flash("Redirigiendo a Stripe Checkout… (demo)")}>Finalizar compra</button>
            <p className="secure"><ShieldCheck size={13} /> Pago seguro con Stripe</p>
          </div>
        )}
      </aside>

      {/* WISHLIST */}
      <aside className={`drawer ${wishOpen ? "open" : ""}`}>
        <div className="drawer-h"><h3>Favoritos ({wish.length})</h3><button className="icn" onClick={() => setWishOpen(false)}><X size={20} /></button></div>
        <div className="drawer-b">
          {wish.length === 0 ? <p className="empty sm">Aún no guardas piezas.</p> : wish.map((i) => (
            <div className="line" key={i.id}>
              <div className="line-img" style={{ cursor: "pointer" }} onClick={() => { setWishOpen(false); open(i); }}><Jewel type={i.type} gem={i.gem} /></div>
              <div className="line-info">
                <strong>{i.name}</strong><span className="price sm">{fmt(i.price)}</span>
                <div className="line-qty"><button className="mini" onClick={() => add(i, 1)}>Añadir</button><button className="rm" onClick={() => toggleWish(i)}><Trash2 size={14} /></button></div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* SEARCH */}
      {searchOpen && (
        <div className="search">
          <div className="search-bar">
            <Search size={20} />
            <input autoFocus placeholder="Buscar anillos, collares, colecciones…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="icn" onClick={() => setSearchOpen(false)}><X size={22} /></button>
          </div>
          <div className="search-res">
            {(q ? PRODUCTS.filter((p) => (p.name + p.materials + p.collection).toLowerCase().includes(q.toLowerCase())) : featured).slice(0, 6).map((p) => (
              <button key={p.id} className="sr" onClick={() => { setSearchOpen(false); open(p); }}>
                <div className="sr-img"><Jewel type={p.type} gem={p.gem} /></div>
                <div><strong>{p.name}</strong><span className="muted small">{p.materials}</span></div>
                <span className="price sm">{fmt(p.price)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="msheet">
          <div className="drawer-h"><span className="wordmark">AZUL MARINO</span><button className="icn" onClick={() => setMenuOpen(false)}><X size={22} /></button></div>
          <nav className="mnav">
            <a onClick={() => goShop("todos")}>Tienda</a>
            {CATEGORIES.map((c) => <a key={c.id} onClick={() => goShop(c.id)}>{c.name}</a>)}
            <a onClick={() => { home(); setMenuOpen(false); }}>Nosotros</a>
            <a href="#">Contacto</a>
          </nav>
        </div>
      )}

      {/* WHATSAPP FAB */}
      <a className="fab" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={24} /></a>

      {/* TOAST */}
      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
    </div>
  );
}

/* ============================== STYLES ============================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0}
.am{
  --ink:#0E1726; --navy:#13293D; --navy2:#1B3A57;
  --gold:#C99A2E; --gold-d:#A87E1E; --gold-l:#E3C77A;
  --teal:#176B82; --ivory:#FBF9F4; --cream:#F1EBE0; --cream2:#E7DECF;
  --line:rgba(14,23,38,.12); --muted:#6c6456;
  font-family:'Jost',system-ui,sans-serif; color:var(--ink);
  background:var(--ivory); line-height:1.6; -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.am h1,.am h2,.am h3,.am h4{font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1.08;letter-spacing:.2px}
.am a{cursor:pointer;text-decoration:none;color:inherit}
.am button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
.am img{max-width:100%}
.muted{color:var(--muted)}
.small{font-size:.82rem}
.kicker{font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:var(--gold-d);font-weight:500;display:block;margin-bottom:.7rem}
.kicker.light{color:var(--gold-l)}
.wordmark{font-family:'Jost',sans-serif;font-weight:400;letter-spacing:.42em;font-size:.82rem;padding-left:.42em}

/* reveal */
.reveal{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:none}

/* bar + header */
.bar{background:var(--ink);color:var(--cream);text-align:center;font-size:.72rem;letter-spacing:.12em;padding:.6rem 1rem}
.hdr{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;
  padding:.9rem clamp(1rem,4vw,3rem);background:rgba(251,249,244,.86);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.nav{display:flex;gap:1.8rem;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase}
.nav a{position:relative;padding:.2rem 0}
.nav a::after{content:"";position:absolute;left:0;bottom:-2px;height:1px;width:0;background:var(--gold);transition:width .35s}
.nav a:hover::after{width:100%}
.brand{display:flex;align-items:center;justify-self:center}
.actions{display:flex;gap:.3rem;justify-self:end;align-items:center}
.icn{position:relative;width:40px;height:40px;display:grid;place-items:center;border-radius:50%;transition:background .25s}
.icn:hover{background:var(--cream)}
.dot{position:absolute;top:4px;right:3px;background:var(--teal);color:#fff;font-size:.6rem;font-style:normal;min-width:16px;height:16px;border-radius:9px;display:grid;place-items:center;padding:0 3px;font-family:'Jost'}
.only-d{display:flex} .only-m{display:none}

/* hero */
.hero{position:relative;display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:2rem;
  padding:clamp(3rem,8vw,7rem) clamp(1.2rem,5vw,4rem) clamp(3rem,7vw,6rem);
  background:linear-gradient(160deg,#0E1726 0%,#13293D 55%,#1B3A57 100%);color:var(--ivory);overflow:hidden}
.hero-glow{position:absolute;width:60vw;height:60vw;right:-12vw;top:-10vw;border-radius:50%;
  background:radial-gradient(circle,rgba(201,154,46,.22),transparent 62%);pointer-events:none}
.hero-grain{position:absolute;inset:0;opacity:.05;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.hero-inner{position:relative;z-index:2;max-width:560px}
.eyebrow{font-size:.72rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-l)}
.hero h1{font-size:clamp(2.8rem,7vw,5.4rem);margin:1.1rem 0 1.2rem;font-weight:400}
.hero h1 em{font-style:italic;color:var(--gold-l)}
.lead{font-size:1.08rem;color:rgba(251,249,244,.8);max-width:440px;font-weight:300}
.hero-cta{display:flex;gap:.9rem;margin-top:2rem;flex-wrap:wrap}
.hero-art{position:relative;z-index:2;display:grid;place-items:center}
.hero-jewel{width:min(360px,70%);filter:drop-shadow(0 30px 60px rgba(0,0,0,.5));animation:float 7s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:.5rem;background:var(--gold);color:#1a1308;
  padding:.85rem 1.7rem;border-radius:2px;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500;
  transition:transform .3s,background .3s,box-shadow .3s}
.btn:hover{background:var(--gold-l);transform:translateY(-2px);box-shadow:0 12px 30px rgba(201,154,46,.3)}
.btn.ghost{background:transparent;border:1px solid currentColor;color:inherit}
.btn.ghost:hover{background:rgba(255,255,255,.08);box-shadow:none}
.btn.block{width:100%;justify-content:center;padding:1rem}
.link{display:inline-flex;align-items:center;gap:.4rem;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-d);transition:gap .3s}
.link:hover{gap:.7rem}
.link.big{font-size:.82rem}

/* trust */
.trust{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;padding:2.5rem clamp(1.2rem,5vw,4rem);
  background:var(--cream);border-bottom:1px solid var(--line)}
.trust-i{display:flex;align-items:center;gap:.9rem;color:var(--navy)}
.trust-i div{display:flex;flex-direction:column}
.trust-i strong{font-size:.86rem;font-weight:500}
.trust-i span{font-size:.76rem;color:var(--muted)}

/* sections */
.sec{padding:clamp(3rem,7vw,6rem) clamp(1.2rem,5vw,4rem);max-width:1280px;margin:0 auto}
.sec-head{margin-bottom:2.6rem}
.sec-head h2{font-size:clamp(2rem,4.5vw,3.2rem)}
.sec-head.center{text-align:center}
.sec-head.row{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem}

/* collections */
.coll-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
.coll{position:relative;text-align:left;padding:2.4rem 2rem;border:1px solid var(--line);border-radius:6px;
  background:var(--cream);overflow:hidden;transition:transform .4s,box-shadow .4s;min-height:230px;display:flex;flex-direction:column}
.coll:hover{transform:translateY(-6px);box-shadow:0 24px 50px rgba(14,23,38,.12)}
.coll-orb{position:absolute;width:170px;height:170px;border-radius:50%;right:-50px;top:-50px;
  background:radial-gradient(circle,var(--g),transparent 70%);opacity:.5;transition:transform .6s}
.coll:hover .coll-orb{transform:scale(1.25)}
.coll h3{font-size:2rem;margin-bottom:.3rem}
.coll p{color:var(--muted);font-size:.9rem;flex:1}
.coll .link{margin-top:1rem}

/* grid + cards */
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4rem}
.card{cursor:pointer;background:#fff;border:1px solid var(--line);border-radius:6px;overflow:hidden;
  transition:transform .4s,box-shadow .4s;display:flex;flex-direction:column}
.card:hover{transform:translateY(-6px);box-shadow:0 26px 50px rgba(14,23,38,.14)}
.card-media{position:relative;aspect-ratio:1;background:radial-gradient(circle at 50% 40%,#fff,var(--cream));display:grid;place-items:center;overflow:hidden}
.jewel-wrap{width:62%;transition:transform .55s cubic-bezier(.16,1,.3,1)}
.card:hover .jewel-wrap{transform:scale(1.08) rotate(-2deg)}
.card-collection{position:absolute;top:.8rem;left:.8rem;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-d)}
.wish{position:absolute;top:.6rem;right:.6rem;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.85);
  display:grid;place-items:center;color:var(--navy);z-index:3;transition:transform .3s,background .3s}
.wish:hover{transform:scale(1.12)} .wish.on{color:var(--teal)}
.quick{position:absolute;left:0;right:0;bottom:0;background:var(--ink);color:#fff;padding:.85rem;font-size:.72rem;
  letter-spacing:.14em;text-transform:uppercase;transform:translateY(101%);transition:transform .4s;z-index:3}
.card:hover .quick{transform:translateY(0)}
.quick:hover{background:var(--gold);color:#1a1308}
.card-body{padding:1.1rem 1.1rem 1.3rem}
.card-body h3{font-size:1.25rem;line-height:1.15}
.card-foot{display:flex;justify-content:space-between;align-items:center;margin-top:.7rem}
.price{font-family:'Cormorant Garamond';font-size:1.3rem;font-weight:600;color:var(--navy)}
.price.sm{font-size:1.05rem}
.stars{display:inline-flex;gap:1px}

/* categories */
.cats{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4rem;max-width:1280px}
.cat{display:flex;flex-direction:column;align-items:center;gap:.8rem;padding:2rem 1rem;border:1px solid var(--line);
  border-radius:6px;background:var(--cream);transition:transform .4s,background .4s}
.cat:hover{transform:translateY(-5px);background:#fff;box-shadow:0 20px 40px rgba(14,23,38,.1)}
.cat svg{width:84px;height:84px}
.cat span{font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;color:var(--navy)}

/* toolbar */
.toolbar{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:1.6rem}
.chips{display:flex;gap:.5rem;flex-wrap:wrap}
.chip{padding:.5rem 1.1rem;border:1px solid var(--line);border-radius:30px;font-size:.78rem;letter-spacing:.06em;
  background:#fff;transition:all .3s}
.chip:hover{border-color:var(--gold)} .chip.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.sortbox{display:flex;align-items:center;gap:.6rem}
.sortbox label{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.select{position:relative;display:flex;align-items:center}
.select select{appearance:none;background:#fff;border:1px solid var(--line);border-radius:3px;padding:.55rem 2rem .55rem .9rem;
  font-family:inherit;font-size:.82rem;cursor:pointer}
.select svg{position:absolute;right:.6rem;pointer-events:none;color:var(--muted)}
.filter-note{margin:-.5rem 0 1.2rem}
.empty{text-align:center;padding:3rem;color:var(--muted);font-family:'Cormorant Garamond';font-size:1.4rem}
.empty.sm{font-size:1.1rem;padding:2rem 1rem}

/* editorial */
.editorial{display:grid;grid-template-columns:1fr 1fr;gap:0;background:var(--cream);align-items:stretch}
.edi-art{background:linear-gradient(140deg,var(--navy),var(--navy2));display:grid;place-items:center;padding:4rem 2rem;min-height:420px}
.edi-jewel{width:min(300px,70%);filter:drop-shadow(0 24px 50px rgba(0,0,0,.4))}
.edi-txt{padding:clamp(2.5rem,6vw,5rem)}
.edi-txt h2{font-size:clamp(2rem,4vw,3rem);margin-bottom:1.2rem}
.edi-txt p{color:#4a4536;margin-bottom:1rem;max-width:46ch}
.edi-txt .btn{margin-top:1rem}

/* testimonials */
.testi{background:var(--ivory)}
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4rem}
.quote{background:#fff;border:1px solid var(--line);border-radius:6px;padding:2rem;display:flex;flex-direction:column;gap:1rem}
.quote p{font-family:'Cormorant Garamond';font-size:1.35rem;line-height:1.4;color:var(--navy)}
.quote-by{margin-top:auto} .quote-by strong{display:block;font-weight:500} .quote-by span{font-size:.78rem;color:var(--muted)}

/* newsletter */
.news{background:linear-gradient(160deg,#0E1726,#13293D);color:var(--ivory);text-align:center;
  padding:clamp(3.5rem,8vw,6rem) 1.2rem}
.news h2{font-size:clamp(2rem,4.5vw,3.2rem);margin-bottom:.8rem}
.news p{color:rgba(251,249,244,.75);max-width:46ch;margin:0 auto 2rem}
.news-form{display:flex;gap:.6rem;max-width:460px;margin:0 auto;flex-wrap:wrap}
.news-form input{flex:1;min-width:200px;padding:.95rem 1.1rem;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.06);
  color:#fff;border-radius:3px;font-family:inherit;font-size:.9rem}
.news-form input::placeholder{color:rgba(255,255,255,.5)}
.news small{display:block;margin-top:1rem;color:rgba(251,249,244,.5);font-size:.75rem}

/* instagram */
.ig-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:.7rem}
.ig-tile{position:relative;aspect-ratio:1;background:radial-gradient(circle at 50% 40%,#fff,var(--cream));border-radius:4px;
  display:grid;place-items:center;overflow:hidden;border:1px solid var(--line)}
.ig-tile svg{width:60%;transition:transform .5s}
.ig-tile:hover svg{transform:scale(1.12)}
.ig-ov{position:absolute;inset:0;background:rgba(14,23,38,.55);display:grid;place-items:center;color:#fff;opacity:0;transition:opacity .35s}
.ig-tile:hover .ig-ov{opacity:1}

/* pdp */
.pdp{max-width:1280px;margin:0 auto;padding:1.5rem clamp(1.2rem,5vw,4rem) 2rem}
.back{display:inline-flex;align-items:center;gap:.5rem;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--muted);margin:1rem 0 2rem;transition:color .3s}
.back:hover{color:var(--ink)}
.pdp-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(2rem,5vw,4rem)}
.pdp-gallery{position:sticky;top:90px;align-self:start}
.pdp-main{background:radial-gradient(circle at 50% 40%,#fff,var(--cream));border:1px solid var(--line);border-radius:8px;
  aspect-ratio:1;display:grid;place-items:center;padding:2rem}
.pdp-main svg{width:70%}
.pdp-thumbs{display:flex;gap:.7rem;margin-top:.8rem}
.thumb{width:78px;height:78px;border:1px solid var(--line);border-radius:5px;background:var(--cream);display:grid;place-items:center;padding:.4rem;transition:border .3s}
.thumb svg{width:100%} .thumb.on{border-color:var(--gold);border-width:2px}
.pdp-info h1{font-size:clamp(2.2rem,4vw,3.2rem);margin:.4rem 0 .8rem}
.pdp-meta{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem}
.pdp-price{font-family:'Cormorant Garamond';font-size:2.2rem;font-weight:600;color:var(--navy);margin-bottom:1.2rem}
.pdp-desc{color:#4a4536;margin-bottom:1.8rem;max-width:48ch}
.pdp-opt{margin-bottom:1.6rem}
.pdp-opt label{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:.6rem}
.opts{display:flex;gap:.6rem;flex-wrap:wrap}
.opt{padding:.55rem 1.1rem;border:1px solid var(--line);border-radius:3px;font-size:.8rem;background:#fff;transition:all .3s}
.opt:hover{border-color:var(--gold)} .opt.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.pdp-buy{display:flex;gap:.8rem;margin-bottom:1.2rem;flex-wrap:wrap}
.qty{display:flex;align-items:center;border:1px solid var(--line);border-radius:3px}
.qty button{width:42px;height:48px;display:grid;place-items:center;transition:background .25s}
.qty button:hover{background:var(--cream)} .qty span{width:40px;text-align:center;font-size:.95rem}
.pdp-buy .btn.block{flex:1;min-width:220px}
.pdp-actions{display:flex;gap:1.5rem;flex-wrap:wrap;padding-bottom:1.6rem;border-bottom:1px solid var(--line)}
.pdp-feats{display:grid;grid-template-columns:1fr 1fr;gap:.9rem;margin-top:1.6rem}
.pdp-feats span{display:flex;align-items:center;gap:.5rem;font-size:.84rem;color:var(--navy)}
.pdp-feats .low{color:#b4541f} .pdp-feats .ok{color:#2f7d4f}

/* footer */
.ftr{background:var(--ink);color:var(--cream);padding:clamp(3rem,6vw,5rem) clamp(1.2rem,5vw,4rem) 2rem;margin-top:2rem}
.ftr-top{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:2.5rem;max-width:1280px;margin:0 auto;padding-bottom:3rem;border-bottom:1px solid rgba(255,255,255,.1)}
.ftr .brand{color:var(--cream);margin-bottom:1rem}
.ftr-brand p{font-size:.86rem;max-width:34ch;color:rgba(241,235,224,.6)}
.ftr-social{display:flex;gap:.6rem;margin-top:1.2rem}
.ftr-social a{width:38px;height:38px;border:1px solid rgba(255,255,255,.18);border-radius:50%;display:grid;place-items:center;transition:all .3s}
.ftr-social a:hover{background:var(--gold);color:#1a1308;border-color:var(--gold)}
.ftr-col h4{font-family:'Jost';font-size:.74rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-l);margin-bottom:1.1rem;font-weight:500}
.ftr-col a{display:block;font-size:.86rem;color:rgba(241,235,224,.7);padding:.32rem 0;transition:color .3s}
.ftr-col a:hover{color:var(--gold-l)}
.ftr-bottom{max-width:1280px;margin:1.5rem auto 0;display:flex;justify-content:space-between;font-size:.74rem;color:rgba(241,235,224,.45);flex-wrap:wrap;gap:.5rem}

/* drawers */
.scrim{position:fixed;inset:0;background:rgba(14,23,38,.45);backdrop-filter:blur(2px);z-index:60;animation:fade .3s}
@keyframes fade{from{opacity:0}to{opacity:1}}
.drawer{position:fixed;top:0;right:0;height:100%;width:min(420px,100%);background:var(--ivory);z-index:70;
  transform:translateX(102%);transition:transform .42s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column;box-shadow:-20px 0 60px rgba(0,0,0,.2)}
.drawer.open{transform:none}
.drawer-h{display:flex;justify-content:space-between;align-items:center;padding:1.3rem 1.4rem;border-bottom:1px solid var(--line)}
.drawer-h h3{font-size:1.5rem}
.drawer-b{flex:1;overflow-y:auto;padding:1rem 1.4rem}
.line{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--line)}
.line-img{width:74px;height:74px;flex-shrink:0;background:radial-gradient(circle,#fff,var(--cream));border:1px solid var(--line);border-radius:5px;display:grid;place-items:center;padding:.4rem}
.line-img svg{width:100%}
.line-info{flex:1;display:flex;flex-direction:column;gap:.2rem}
.line-info strong{font-size:.92rem;font-weight:500}
.line-qty{display:flex;align-items:center;gap:.4rem;margin-top:.4rem}
.line-qty button{width:26px;height:26px;border:1px solid var(--line);border-radius:3px;display:grid;place-items:center;transition:background .25s}
.line-qty button:hover{background:var(--cream)}
.line-qty span{min-width:22px;text-align:center;font-size:.85rem}
.line-qty .rm{margin-left:auto;border:none;color:var(--muted)} .line-qty .rm:hover{color:#b4541f;background:none}
.line-qty .mini{width:auto;padding:0 .8rem;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase}
.drawer-f{padding:1.2rem 1.4rem;border-top:1px solid var(--line);background:var(--cream)}
.coupon{display:flex;gap:.5rem;margin-bottom:1rem}
.coupon input{flex:1;padding:.65rem .8rem;border:1px solid var(--line);border-radius:3px;font-family:inherit;font-size:.82rem;background:#fff}
.coupon button{padding:0 1rem;border:1px solid var(--ink);border-radius:3px;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;transition:all .3s}
.coupon button:hover{background:var(--ink);color:#fff}
.totals{margin-bottom:1rem;font-size:.88rem}
.totals>div{display:flex;justify-content:space-between;padding:.32rem 0}
.totals .disc{color:#2f7d4f}
.totals .grand{border-top:1px solid var(--line);margin-top:.4rem;padding-top:.7rem;font-family:'Cormorant Garamond';font-size:1.35rem;font-weight:600;color:var(--navy)}
.secure{text-align:center;font-size:.74rem;color:var(--muted);margin-top:.8rem;display:flex;align-items:center;justify-content:center;gap:.4rem}

/* search */
.search{position:fixed;inset:0;z-index:80;background:rgba(251,249,244,.98);backdrop-filter:blur(8px);animation:fade .25s;overflow-y:auto}
.search-bar{display:flex;align-items:center;gap:1rem;padding:1.6rem clamp(1.2rem,6vw,4rem);border-bottom:1px solid var(--line);max-width:900px;margin:0 auto;width:100%}
.search-bar input{flex:1;font-family:'Cormorant Garamond';font-size:1.6rem;border:none;background:none;outline:none;color:var(--ink)}
.search-res{max-width:900px;margin:0 auto;padding:1rem clamp(1.2rem,6vw,4rem) 3rem}
.sr{display:flex;align-items:center;gap:1rem;width:100%;text-align:left;padding:.9rem;border-radius:6px;transition:background .25s}
.sr:hover{background:var(--cream)}
.sr-img{width:60px;height:60px;background:radial-gradient(circle,#fff,var(--cream));border:1px solid var(--line);border-radius:5px;display:grid;place-items:center;padding:.3rem}
.sr-img svg{width:100%} .sr div{flex:1} .sr strong{display:block;font-weight:500}

/* mobile menu */
.msheet{position:fixed;inset:0;z-index:80;background:var(--ivory);animation:fade .25s;display:flex;flex-direction:column}
.mnav{display:flex;flex-direction:column;padding:1rem 1.4rem}
.mnav a{padding:1.1rem 0;border-bottom:1px solid var(--line);font-family:'Cormorant Garamond';font-size:1.8rem;color:var(--navy)}

/* fab + toast */
.fab{position:fixed;bottom:1.4rem;right:1.4rem;z-index:50;width:56px;height:56px;border-radius:50%;background:#25D366;color:#fff;
  display:grid;place-items:center;box-shadow:0 10px 30px rgba(37,211,102,.4);transition:transform .3s}
.fab:hover{transform:scale(1.08)}
.toast{position:fixed;bottom:1.6rem;left:50%;transform:translate(-50%,30px);z-index:90;background:var(--ink);color:var(--cream);
  padding:.85rem 1.5rem;border-radius:4px;font-size:.84rem;letter-spacing:.04em;opacity:0;pointer-events:none;transition:all .35s;box-shadow:0 12px 30px rgba(0,0,0,.3)}
.toast.show{opacity:1;transform:translate(-50%,0)}

/* responsive */
@media(max-width:1024px){
  .grid,.cats{grid-template-columns:repeat(3,1fr)}
  .ig-grid{grid-template-columns:repeat(3,1fr)}
  .testi-grid{grid-template-columns:1fr}
  .ftr-top{grid-template-columns:1fr 1fr}
}
@media(max-width:860px){
  .only-d{display:none} .only-m{display:flex}
  .hdr{grid-template-columns:auto 1fr auto;padding:.8rem 1rem}
  .hero{grid-template-columns:1fr;text-align:center}
  .hero-inner{margin:0 auto} .hero-cta{justify-content:center}
  .hero-art{order:-1;margin-bottom:1rem} .hero-jewel{width:200px}
  .trust{grid-template-columns:repeat(2,1fr);gap:1.2rem}
  .coll-grid{grid-template-columns:1fr}
  .editorial{grid-template-columns:1fr} .edi-art{min-height:300px}
  .pdp-grid{grid-template-columns:1fr} .pdp-gallery{position:static}
  .sec-head.row{flex-direction:column;align-items:flex-start}
}
@media(max-width:560px){
  .grid,.cats{grid-template-columns:repeat(2,1fr);gap:.9rem}
  .ig-grid{grid-template-columns:repeat(3,1fr)}
  .ftr-top{grid-template-columns:1fr;gap:2rem}
  .ftr-bottom{flex-direction:column}
  .card-body h3{font-size:1.1rem}
  .wordmark{letter-spacing:.3em;font-size:.74rem}
  .pdp-feats{grid-template-columns:1fr}
}
`;
