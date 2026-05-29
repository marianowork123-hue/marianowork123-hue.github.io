"use client";
import React from "react";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import Jewel from "@/components/Jewel";
import { useCart } from "@/components/cart";
import type { Product } from "@/types";
const fmt = (n: number) => "$" + Number(n).toLocaleString("es-MX");

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <article className="card">
      <Link href={`/producto/${p.slug}`} className="card-media" style={{ display: "grid" }}>
        {p.collection && <span className="card-collection">{p.collection}</span>}
        <div className="jewel-wrap">
          {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Jewel type={p.type} gem={p.gem} />}
        </div>
      </Link>
      <button className="quick" onClick={() => add(p, 1)}>Añadir al carrito</button>
      <div className="card-body">
        <h3><Link href={`/producto/${p.slug}`}>{p.name}</Link></h3>
        <p className="muted small">{p.materials}</p>
        <div className="card-foot">
          <span className="price">{fmt(p.price)}</span>
          <span className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < (p.rating || 5) ? "#C99A2E" : "none"} stroke={i < (p.rating || 5) ? "#C99A2E" : "#cbb98a"} />)}</span>
        </div>
      </div>
    </article>
  );
}
