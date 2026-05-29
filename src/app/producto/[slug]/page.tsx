import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Truck, ShieldCheck, Gem, Check } from "lucide-react";
import Jewel from "@/components/Jewel";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import { getProduct, getProducts } from "@/lib/products";
const fmt = (n: number) => "$" + Number(n).toLocaleString("es-MX");

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  return { title: p ? `${p.name} — Azul Marino` : "Producto", description: p?.description || "" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) return notFound();
  const all = await getProducts(p.category_id || undefined);
  const related = all.filter(x => x.slug !== p.slug).slice(0, 3);
  return (
    <main className="pdp">
      <Link href="/tienda" className="back"><ArrowLeft size={16} /> Volver a la tienda</Link>
      <div className="pdp-grid">
        <div className="pdp-gallery"><div className="pdp-main">{p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: "100%", borderRadius: 8 }} /> : <Jewel type={p.type} gem={p.gem} size={420} />}</div></div>
        <div className="pdp-info">
          {p.collection && <span className="kicker">{p.collection}</span>}
          <h1>{p.name}</h1>
          <div className="pdp-meta"><span className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < (p.rating || 5) ? "#C99A2E" : "none"} stroke="#C99A2E" />)}</span><span className="muted small">SKU {p.sku}</span></div>
          <div className="pdp-price">{fmt(p.price)}</div>
          <p className="pdp-desc">{p.description}</p>
          <div className="pdp-buy"><AddToCart product={p} label={`Añadir al carrito · ${fmt(p.price)}`} block /></div>
          <div className="pdp-feats">
            <span className={p.stock <= 3 ? "low" : "ok"}><Check size={14} /> {p.stock <= 3 ? `Solo ${p.stock} disponibles` : "En stock"}</span>
            <span><Truck size={14} /> Envío gratis</span>
            <span><ShieldCheck size={14} /> Garantía de por vida</span>
            <span><Gem size={14} /> {p.materials}</span>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="sec"><div className="sec-head"><span className="kicker">También te puede gustar</span><h2>Piezas relacionadas</h2></div><div className="grid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div></section>
      )}
    </main>
  );
}
