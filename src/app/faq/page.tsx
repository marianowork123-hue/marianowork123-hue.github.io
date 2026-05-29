import React from "react";
export const metadata = { title: "Preguntas frecuentes — Azul Marino" };
export default function Page() {
  return (<main className="sec" style={{ maxWidth: 820 }}>
    <div className="sec-head"><span className="kicker">Azul Marino</span><h2>Preguntas frecuentes</h2></div>
    <div style={{ color: "#4a4536", lineHeight: 1.8 }}><p><strong>¿Las piezas son de oro real?</strong><br/>Sí, trabajamos oro de 18 quilates con gemas seleccionadas a mano.</p><p style={{marginTop:"1rem"}}><strong>¿Cuánto tarda el envío?</strong><br/>Entre 3 y 7 días hábiles. Envío gratis en compras mayores a $1,500.</p><p style={{marginTop:"1rem"}}><strong>¿Tienen garantía?</strong><br/>Todas nuestras joyas incluyen garantía de por vida y mantenimiento.</p></div>
  </main>);
}
