import React from "react";
import Link from "next/link";
export const metadata = { title: "Pago cancelado" };
export default function Cancelado() {
  return (<main className="sec" style={{ textAlign: "center", minHeight: "50vh" }}>
    <div className="sec-head center"><span className="kicker">Pago cancelado</span><h2>Tu pago no se completó</h2></div>
    <p className="muted" style={{ maxWidth: 460, margin: "0 auto 2rem" }}>No te preocupes, no se realizó ningún cargo. Tu carrito sigue disponible.</p>
    <Link href="/tienda" className="btn">Volver a la tienda</Link>
  </main>);
}
