import React from "react";
export const metadata = { title: "Mi cuenta — Azul Marino" };
export default function Page() {
  return (<main className="sec" style={{ maxWidth: 820 }}>
    <div className="sec-head"><span className="kicker">Azul Marino</span><h2>Mi cuenta</h2></div>
    <div style={{ color: "#4a4536", lineHeight: 1.8 }}><p>Aquí podrás ver tu historial de pedidos e información de envío.</p><p style={{marginTop:"1rem",color:"#9a917e"}}>Función disponible al iniciar sesión (incluida en el sistema de autenticación).</p></div>
  </main>);
}
