import React from "react";
import AdminShell from "@/components/AdminShell";
import { supabaseServer } from "@/lib/supabase/server";
const fmt = (n: number) => "$" + Number(n || 0).toLocaleString("es-MX");
export default async function Pedidos() {
  let rows: any[] = [];
  try { const sb = supabaseServer(); const { data } = await sb.from("orders").select("*").order("created_at", { ascending: false }); rows = data || []; } catch {}
  return (
    <AdminShell>
      <div className="adm-h"><div><h1>Pedidos</h1><p>Todas las compras de tu tienda.</p></div></div>
      <div className="adm-panel">
        {rows.length === 0 ? <p className="muted">Todavía no tienes pedidos.</p> : (
          <table className="adm-list"><thead><tr><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}><td>{new Date(r.created_at).toLocaleString("es-MX")}</td><td>{r.email || "—"}</td><td>{fmt(r.total)}</td><td><span className="badge">{r.status}</span></td></tr>)}</tbody></table>
        )}
      </div>
    </AdminShell>
  );
}
