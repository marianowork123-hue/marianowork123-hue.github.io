import React from "react";
export const metadata = { title: "Contacto — Azul Marino" };
export default function Page() {
  return (<main className="sec" style={{ maxWidth: 820 }}>
    <div className="sec-head"><span className="kicker">Azul Marino</span><h2>Contacto</h2></div>
    <div style={{ color: "#4a4536", lineHeight: 1.8 }}><p>Escríbenos y con gusto te ayudamos a elegir tu pieza.</p><p style={{marginTop:"1rem"}}><strong>WhatsApp:</strong> +52 123 456 7890<br/><strong>Correo:</strong> hola@azulmarino.com<br/><strong>Horario:</strong> Lun a Vie, 10:00–19:00</p></div>
  </main>);
}
