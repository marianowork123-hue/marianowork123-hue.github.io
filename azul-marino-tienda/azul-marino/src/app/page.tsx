import React from "react";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Gem, Sparkles } from "lucide-react";
import Jewel from "@/components/Jewel";
import ProductCard from "@/components/ProductCard";
import { getContent } from "@/lib/content";
import { getProducts, getCategories } from "@/lib/products";
const fmt = (n: number) => "$" + Number(n).toLocaleString("es-MX");

export default async function Home() {
  const content = await getContent();
  const products = await getProducts();
  const categories = await getCategories();
  const featured = products.filter(p => p.featured).slice(0, 4);
  const list = featured.length ? featured : products.slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <span className="eyebrow">{content.hero_eyebrow}</span>
          <h1>{content.hero_title.split("\n").map((l, i) => <React.Fragment key={i}>{i > 0 ? <br /> : null}{i === 1 ? <em>{l}</em> : l}</React.Fragment>)}</h1>
          <p className="lead">{content.hero_subtitle}</p>
          <div className="hero-cta">
            <Link href="/tienda" className="btn">Explorar la colección <ArrowRight size={16} /></Link>
            <Link href="/tienda?cat=anillos" className="btn ghost">Ver anillos</Link>
          </div>
        </div>
        <div className="hero-art"><div className="hero-jewel"><Jewel type="necklace" gem="#176B82" /></div></div>
      </section>

      <section className="trust">
        {[[Truck, "Envío asegurado", "Gratis desde " + fmt(1500)], [ShieldCheck, "Garantía de por vida", "Mantenimiento incluido"], [Gem, "Hecho a mano", "Por orfebres locales"], [Sparkles, "Pago seguro", "Cifrado de extremo a extremo"]].map(([I, t, s]: any, i) => (
          <div className="trust-i" key={i}><I size={20} /><div><strong>{t}</strong><span>{s}</span></div></div>
        ))}
      </section>

      <section className="sec">
        <div className="sec-head row"><div><span className="kicker">Destacados</span><h2>Favoritos de la casa</h2></div><Link href="/tienda" className="link big">Ver todo <ArrowRight size={15} /></Link></div>
        <div className="grid">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="sec cats">
        {categories.map(c => (
          <Link key={c.id} href={`/tienda?cat=${c.id}`} className="cat">
            <Jewel type={c.id === "anillos" ? "ring" : c.id === "collares" ? "necklace" : c.id === "aretes" ? "earrings" : "bracelet"} gem="#176B82" />
            <span>{c.name}</span>
          </Link>
        ))}
      </section>

      <section className="editorial">
        <div className="edi-art"><div className="edi-jewel"><Jewel type="ring" gem="#C99A2E" /></div></div>
        <div className="edi-txt"><span className="kicker">Nosotros</span><h2>{content.about_title}</h2><p>{content.about_text}</p><Link href="/tienda" className="btn ghost">Conocer las piezas</Link></div>
      </section>

      <section className="news">
        <span className="kicker light">Newsletter</span>
        <h2>{content.newsletter_title}</h2>
        <p>Acceso anticipado, ediciones limitadas y un 10% en tu primera compra.</p>
        <div className="news-form"><input placeholder="tu@correo.com" /><Link href="/tienda" className="btn">Suscribirme</Link></div>
      </section>
    </main>
  );
}
