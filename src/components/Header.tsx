"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X, Minus, Plus, Trash2, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart";
import Jewel from "@/components/Jewel";
const GOLD = "#C99A2E";
const fmt = (n: number) => "$" + Number(n).toLocaleString("es-MX");

export default function Header({ categories }: { categories: { id: string; name: string }[] }) {
  const { items, count, subtotal, add, dec, remove, open, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  async function checkout() {
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(i => ({ name: i.name, price: i.price, qty: i.qty })) }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url; else alert("Configura Stripe para finalizar la compra.");
    } catch { alert("Configura Stripe para finalizar la compra."); }
  }

  return (
    <>
      <header className="hdr">
        <button className="icn only-m" onClick={() => setMenu(true)} aria-label="Menú"><Menu size={20} /></button>
        <nav className="nav only-d">
          <Link href="/tienda">Tienda</Link>
          {categories.slice(0, 3).map(c => <Link key={c.id} href={`/tienda?cat=${c.id}`}>{c.name}</Link>)}
        </nav>
        <Link href="/" className="brand">
          <svg width="34" height="26" viewBox="0 0 60 46"><path d="M14 12 L30 4 L46 12 L46 14 L30 30 L14 14 Z" fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" /><path d="M22 12 L30 4 L38 12 L30 18 Z" fill="#176B82" /></svg>
          <span className="wordmark">AZUL MARINO</span>
        </Link>
        <div className="actions">
          <Link href="/tienda" className="icn" aria-label="Buscar"><Search size={19} /></Link>
          <Link href="/cuenta" className="icn only-d" aria-label="Cuenta"><User size={19} /></Link>
          <button className="icn" onClick={() => setOpen(true)} aria-label="Carrito"><ShoppingBag size={19} />{count > 0 && <i className="dot">{count}</i>}</button>
        </div>
      </header>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-h"><h3>Tu carrito ({count})</h3><button className="icn" onClick={() => setOpen(false)}><X size={20} /></button></div>
        <div className="drawer-b">
          {items.length === 0 ? <p className="empty sm">Tu carrito está vacío.</p> : items.map(i => (
            <div className="line" key={i.id}>
              <div className="line-img">{i.image_url ? <img src={i.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5 }} /> : <Jewel type={i.type} gem={i.gem} />}</div>
              <div className="line-info"><strong>{i.name}</strong><span className="muted small">{i.materials}</span>
                <div className="line-qty"><button onClick={() => dec(i.id)}><Minus size={13} /></button><span>{i.qty}</span><button onClick={() => add(i, 1)}><Plus size={13} /></button><button className="rm" onClick={() => remove(i.id)}><Trash2 size={14} /></button></div>
              </div>
              <span className="price sm">{fmt(i.price * i.qty)}</span>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="drawer-f">
            <div className="totals"><div><span>Subtotal</span><span>{fmt(subtotal)}</span></div><div><span>Envío</span><span>{shipping === 0 ? "Gratis" : fmt(shipping)}</span></div><div className="grand"><span>Total</span><span>{fmt(total)}</span></div></div>
            <button className="btn block" onClick={checkout}>Finalizar compra</button>
            <p className="secure"><ShieldCheck size={13} /> Pago seguro con Stripe</p>
          </div>
        )}
      </aside>

      {menu && (
        <div className="msheet">
          <div className="drawer-h"><span className="wordmark">AZUL MARINO</span><button className="icn" onClick={() => setMenu(false)}><X size={22} /></button></div>
          <nav className="mnav" onClick={() => setMenu(false)}>
            <Link href="/tienda">Tienda</Link>
            {categories.map(c => <Link key={c.id} href={`/tienda?cat=${c.id}`}>{c.name}</Link>)}
            <Link href="/cuenta">Mi cuenta</Link>
          </nav>
        </div>
      )}
    </>
  );
}
