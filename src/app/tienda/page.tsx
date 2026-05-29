import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/products";

export const metadata = { title: "Tienda — Azul Marino Joyería" };

export default async function Tienda({ searchParams }: { searchParams: { cat?: string } }) {
  const cat = searchParams.cat || "todos";
  const products = await getProducts(cat);
  const categories = await getCategories();
  const chips = [{ id: "todos", name: "Todo" }, ...categories];
  return (
    <main>
      <section className="sec">
        <div className="sec-head"><span className="kicker">Tienda</span><h2>Catálogo completo</h2></div>
        <div className="toolbar">
          <div className="chips">{chips.map(c => <Link key={c.id} href={c.id === "todos" ? "/tienda" : `/tienda?cat=${c.id}`} className={`chip ${cat === c.id ? "on" : ""}`}>{c.name}</Link>)}</div>
        </div>
        <div className="grid">{products.map(p => <ProductCard key={p.id} p={p} />)}</div>
        {products.length === 0 && <p className="empty">No hay piezas en esta categoría todavía.</p>}
      </section>
    </main>
  );
}
