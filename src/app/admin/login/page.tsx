"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true); setMsg("");
    try {
      const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password: pass });
      if (error) setMsg(error.message);
      else { router.push("/admin"); router.refresh(); }
    } catch { setMsg("Configura Supabase para iniciar sesión."); }
    setLoading(false);
  }
  return (
    <div className="adm" style={{ display: "flex" }}>
      <div className="adm-login">
        <h1>Panel de Azul Marino</h1>
        <p>Ingresa con tu correo y contraseña</p>
        {msg && <div className="adm-msg err">{msg}</div>}
        <div className="adm-field"><label>Correo</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" /></div>
        <div className="adm-field"><label>Contraseña</label><input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="••••••••" /></div>
        <button className="adm-btn gold" style={{ width: "100%", justifyContent: "center" }} onClick={submit} disabled={loading}>{loading ? "Entrando…" : "Entrar"}</button>
      </div>
    </div>
  );
}
