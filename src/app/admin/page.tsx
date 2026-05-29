import React from "react";
import AdminShell from "@/components/AdminShell";
import { supabaseServer } from "@/lib/supabase/server";
const fmt = (n: number) => "$" + Number(n || 0).toLocaleString("es-MX");

export default async function Dashboard() {
  let products = 0, orders = 0, paid = 0, recent: any[] = [];
  try {
    const sb = supabaseServer();
    const p = await sb.from("products").select("id", { count: "exact", head: true }); products = p.count || 0;
    const o = await sb.from("orders").select("id", { count: "exact", head: true }); orders = o.count || 0;
    const { data } = await sb.from("orders").select("*").order("created_at", { ascending: false }).limit(6);
    recent = data || []; paid = recent.filter(r => r.status === "paid").reduce((s, r) => s + Number(r.total || 0), 0);
  } catch {}
  return (
    <AdminShell>
      <div className="adm-h"><div><h1>Hola 👋</h1><p>Este es el resumen de tu tienda.</p></div></div>
      <div className="adm-cards">
        <div className="adm-card"><div className="n">{products}</div><div className="l">Productos</div></div>
        <div className="adm-card"><div className="n">{orders}</div><div className="l">Pedidos</div></div>
        <div className="adm-card"><div className="n">{recent.filter(r => r.status === "paid").length}</div><div className="l">Pagados</div></div>
        <div className="adm-card"><div className="n" style={{ fontSize: "1.8rem" }}>{fmt(paid)}</div><div className="l">Ventas recientes</div></div>
      </div>
      <div className="adm-panel">
        <h3 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "1.5rem", marginBottom: "1rem" }}>Últimos pedidos</h3>
        {recent.length === 0 ? <p className="muted">Aún no hay pedidos. Cuando alguien compre, aparecerá aquí.</p> : (
          <table className="adm-list"><thead><tr><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>{recent.map((r, i) => <tr key={i}><td>{new Date(r.created_at).toLocaleDateString("es-MX")}</td><td>{r.email || "—"}</td><td>{fmt(r.total)}</td><td><span className="badge">{r.status}</span></td></tr>)}</tbody></table>
        )}
      </div>
    </AdminShell>
  );
}
