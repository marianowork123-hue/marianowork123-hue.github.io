"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FileText, ShoppingBag, LogOut, ExternalLink } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

const NAV: [string, string, any][] = [
  ["/admin", "Resumen", LayoutDashboard],
  ["/admin/productos", "Productos", Package],
  ["/admin/contenido", "Textos de la web", FileText],
  ["/admin/pedidos", "Pedidos", ShoppingBag],
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  async function logout() { try { await supabaseBrowser().auth.signOut(); } catch {} router.push("/admin/login"); router.refresh(); }
  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-logo"><span style={{ color: "#C99A2E", fontSize: "1.1rem" }}>◆</span> AZUL MARINO</div>
        {NAV.map(([href, label, Icon]) => <Link key={href} href={href} className={path === href ? "on" : ""}><Icon size={17} /> {label}</Link>)}
        <Link href="/" target="_blank"><ExternalLink size={17} /> Ver mi tienda</Link>
        <button onClick={logout} className="out" style={{ background: "none", border: "none", textAlign: "left", display: "flex", alignItems: "center", gap: ".6rem", padding: ".7rem .9rem", cursor: "pointer" }}><LogOut size={15} /> Cerrar sesión</button>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
