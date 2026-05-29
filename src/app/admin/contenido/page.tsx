"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Save } from "lucide-react";

const FIELDS: { key: string; label: string; hint?: string; big?: boolean }[] = [
  { key: "announcement", label: "Barra superior (anuncio)", hint: "El texto que aparece arriba de todo." },
  { key: "hero_eyebrow", label: "Inicio · texto pequeño superior" },
  { key: "hero_title", label: "Inicio · título grande", hint: "Usa Enter para una segunda línea." , big: true },
  { key: "hero_subtitle", label: "Inicio · párrafo del título", big: true },
  { key: "about_title", label: "Sección Nosotros · título" },
  { key: "about_text", label: "Sección Nosotros · texto", big: true },
  { key: "newsletter_title", label: "Newsletter · título" },
  { key: "footer_tagline", label: "Pie de página · descripción", big: true },
  { key: "whatsapp", label: "Número de WhatsApp", hint: "Solo números, con código de país. Ej: 521234567890" },
];

export default function Contenido() {
  const sb = supabaseBrowser();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ t: string; k: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { (async () => { try { const { data } = await sb.from("site_content").select("key,value"); const m: any = {}; (data || []).forEach((r: any) => m[r.key] = r.value || ""); setVals(m); } catch {} })(); }, []);
  const flash = (t: string, k = "ok") => { setMsg({ t, k }); setTimeout(() => setMsg(null), 3000); };

  async function save() {
    setSaving(true);
    try {
      const rows = FIELDS.map(f => ({ key: f.key, value: vals[f.key] ?? "" }));
      const { error } = await sb.from("site_content").upsert(rows);
      flash(error ? "No se pudo guardar. ¿Iniciaste sesión como administrador?" : "¡Textos actualizados! Revisa tu página ✓", error ? "err" : "ok");
    } catch { flash("Error al guardar.", "err"); }
    setSaving(false);
  }

  return (
    <AdminShell>
      <div className="adm-h"><div><h1>Textos de la web</h1><p>Cambia lo que dice tu página. Edita y guarda; no necesitas código.</p></div>
        <button className="adm-btn gold" onClick={save} disabled={saving}><Save size={16} /> {saving ? "Guardando…" : "Guardar cambios"}</button></div>
      {msg && <div className={`adm-msg ${msg.k}`}>{msg.t}</div>}
      <div className="adm-panel">
        {FIELDS.map(f => (
          <div className="adm-field" key={f.key}>
            <label>{f.label}{f.hint && <span style={{ fontWeight: 400, color: "#9a917e" }}> — {f.hint}</span>}</label>
            {f.big ? <textarea value={vals[f.key] || ""} onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))} />
                   : <input value={vals[f.key] || ""} onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))} />}
          </div>
        ))}
        <button className="adm-btn gold" onClick={save} disabled={saving}><Save size={16} /> {saving ? "Guardando…" : "Guardar cambios"}</button>
      </div>
    </AdminShell>
  );
}
