import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
export const metadata = { title: "¡Gracias por tu compra!" };
export default function Exito() {
  return (<main className="sec" style={{ textAlign: "center", minHeight: "50vh" }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#176B82", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 1.4rem" }}><Check size={30} /></div>
    <div className="sec-head center"><span className="kicker">Pedido confirmado</span><h2>¡Gracias por tu compra!</h2></div>
    <p className="muted" style={{ maxWidth: 460, margin: "0 auto 2rem" }}>Recibirás un correo con los detalles de tu pedido. Lo prepararemos con el mayor cuidado.</p>
    <Link href="/" className="btn">Volver al inicio</Link>
  </main>);
}
