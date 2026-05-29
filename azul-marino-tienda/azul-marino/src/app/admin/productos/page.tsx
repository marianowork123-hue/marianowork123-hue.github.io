"use client";
import React, { useEffect, useState, useRef } from "react";
import AdminShell from "@/components/AdminShell";
import Jewel from "@/components/Jewel";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Upload, Trash2, Pencil, Plus, Check } from "lucide-react";
const fmt = (n: number) => "$" + Number(n || 0).toLocaleString("es-MX");
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const EMPTY = { id: "", name: "", price: "", category_id: "anillos", collection: "", materials: "", description: "", stock: "1", type: "ring", gem: "#176B82", image_url: "", featured: false };

// Reduce el tamaño de la imagen automáticamente antes de subirla
async function compress(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const max = 1200; let { width, height } = img;
      if (width > max) { height = Math.round(height * max / width); width = max; }
      const c = document.createElement("canvas"); c.width = width; c.height = height;
      c.getContext("2d")!.drawImage(img, 0, 0, width, height);
      c.toBlob(b => resolve(b || file), "image/jpeg", 0.82);
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

export default function Productos() {
  const sb = supabaseBrowser();
  const [items, setItems] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState<{ t: string; k: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try {
      const { data: c } = await sb.from("categories").select("id,name").order("sort"); if (c) setCats(c);
      const { data } = await sb.from("products").select("*").order("created_at", { ascending: false }); if (data) setItems(data);
    } catch {}
  }
  useEffect(() => { load(); }, []);
  const flash = (t: string, k = "ok") => { setMsg({ t, k }); setTimeout(() => setMsg(null), 3000); };
  const set = (key: string, val: any) => setForm((f: any) => ({ ...f, [key]: val }));

  async function handleFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const blob = await compress(file);
      const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.jpg`;
      const { error } = await sb.storage.from("product-images").upload(path, blob, { upsert: true, contentType: "image/jpeg" });
      if (error) { flash("No se pudo subir la imagen. Revisa el bucket 'product-images'.", "err"); }
      else { const { data } = sb.storage.from("product-images").getPublicUrl(path); set("image_url", data.publicUrl); }
    } catch { flash("Error al procesar la imagen.", "err"); }
    setUploading(false);
  }

  async function save() {
    if (!form.name || !form.price) { flash("Escribe al menos el título y el precio.", "err"); return; }
    const row: any = {
      name: form.name, slug: slugify(form.name), price: Number(form.price),
      category_id: form.category_id, collection: form.collection, materials: form.materials,
      description: form.description, stock: Number(form.stock || 0), type: form.type,
      gem: form.gem, image_url: form.image_url || null,
      sku: "AM-" + form.category_id.slice(0, 2).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000),
      featured: !!form.featured, active: true,
    };
    try {
      if (editing && form.id) { delete row.sku; await sb.from("products").update(row).eq("id", form.id); flash("Producto actualizado ✓"); }
      else { await sb.from("products").insert(row); flash("¡Producto publicado! Ya aparece en tu tienda ✓"); }
      setForm(EMPTY); setEditing(false); load();
    } catch { flash("No se pudo guardar. ¿Iniciaste sesión como administrador?", "err"); }
  }
  function edit(p: any) { setForm({ ...p, price: String(p.price), stock: String(p.stock) }); setEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function del(id: string) { if (!confirm("¿Eliminar este producto?")) return; try { await sb.from("products").delete().eq("id", id); load(); } catch {} }

  return (
    <AdminShell>
      <div className="adm-h"><div><h1>{editing ? "Editar producto" : "Agregar producto"}</h1><p>Sube una foto, escribe los datos y guarda. Aparece solo en la tienda.</p></div>
        {editing && <button className="adm-btn ghost" onClick={() => { setForm(EMPTY); setEditing(false); }}>Cancelar edición</button>}</div>

      {msg && <div className={`adm-msg ${msg.k}`}>{msg.t}</div>}

      <div className="adm-grid2">
        <div className="adm-panel">
          <div className="adm-field"><label>Foto del producto</label>
            <div className={`drop ${over ? "over" : ""}`} onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
              onDrop={e => { e.preventDefault(); setOver(false); handleFile(e.dataTransfer.files?.[0]); }}>
              {uploading ? <p>Subiendo…</p> : form.image_url ? <img src={form.image_url} alt="" /> : <><Upload size={26} style={{ marginBottom: 8 }} /><p>Arrastra una foto aquí<br /><small>o haz clic para elegir (se optimiza sola)</small></p></>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleFile(e.target.files?.[0] || undefined)} />
            {form.image_url && <button className="adm-btn sm ghost" style={{ marginTop: 8 }} onClick={() => set("image_url", "")}>Quitar foto</button>}
          </div>
          <div className="adm-field"><label>Título</label><input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Anillo Solitario Marea" /></div>
          <div className="adm-row">
            <div className="adm-field"><label>Precio (MXN)</label><input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="2480" /></div>
            <div className="adm-field"><label>Stock (cantidad)</label><input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="5" /></div>
          </div>
          <div className="adm-row">
            <div className="adm-field"><label>Categoría</label><select value={form.category_id} onChange={e => set("category_id", e.target.value)}>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="adm-field"><label>Colección (opcional)</label><input value={form.collection} onChange={e => set("collection", e.target.value)} placeholder="Marea" /></div>
          </div>
          <div className="adm-field"><label>Materiales</label><input value={form.materials} onChange={e => set("materials", e.target.value)} placeholder="Oro 18k & topacio azul" /></div>
          <div className="adm-field"><label>Descripción</label><textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe la pieza…" /></div>
          <div className="adm-row">
            <div className="adm-field"><label>Ícono si no subes foto</label><select value={form.type} onChange={e => set("type", e.target.value)}><option value="ring">Anillo</option><option value="necklace">Collar</option><option value="earrings">Aretes</option><option value="bracelet">Pulsera</option></select></div>
            <div className="adm-field"><label>Destacar en portada</label><div style={{ display: "flex", alignItems: "center", gap: 8, height: 42 }}><input type="checkbox" style={{ width: "auto" }} checked={form.featured} onChange={e => set("featured", e.target.checked)} /> <span className="muted small">Mostrar en “Favoritos de la casa”</span></div></div>
          </div>
          <button className="adm-btn gold" onClick={save}>{editing ? <><Check size={16} /> Guardar cambios</> : <><Plus size={16} /> Publicar producto</>}</button>
        </div>

        <div className="adm-prev">
          <p className="muted small" style={{ marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase" }}>Vista previa en vivo</p>
          <article className="card">
            <div className="card-media" style={{ display: "grid" }}>
              {form.collection && <span className="card-collection">{form.collection}</span>}
              <div className="jewel-wrap">{form.image_url ? <img src={form.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Jewel type={form.type} gem={form.gem} />}</div>
            </div>
            <div className="card-body"><h3>{form.name || "Nombre del producto"}</h3><p className="muted small">{form.materials || "Materiales"}</p>
              <div className="card-foot"><span className="price">{form.price ? fmt(Number(form.price)) : "$0"}</span></div></div>
          </article>
        </div>
      </div>

      <div className="adm-panel" style={{ marginTop: "2rem" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond'", fontSize: "1.5rem", marginBottom: "1rem" }}>Tus productos ({items.length})</h3>
        {items.length === 0 ? <p className="muted">Aún no has agregado productos. Llena el formulario de arriba y publica el primero.</p> : (
          <table className="adm-list"><thead><tr><th></th><th>Producto</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
          <tbody>{items.map(p => (
            <tr key={p.id}>
              <td>{p.image_url ? <img className="adm-thumb" src={p.image_url} alt="" /> : <div className="adm-thumb" style={{ display: "grid", placeItems: "center", padding: 4 }}><Jewel type={p.type} gem={p.gem} /></div>}</td>
              <td><strong>{p.name}</strong><br /><span className="muted small">{p.collection}</span></td>
              <td>{fmt(p.price)}</td>
              <td><span className={`badge ${p.stock <= 3 ? "low" : ""}`}>{p.stock}</span></td>
              <td style={{ whiteSpace: "nowrap" }}><button className="adm-btn sm ghost" onClick={() => edit(p)}><Pencil size={13} /></button> <button className="adm-btn sm ghost" onClick={() => del(p.id)}><Trash2 size={13} /></button></td>
            </tr>))}</tbody></table>
        )}
      </div>
    </AdminShell>
  );
}
