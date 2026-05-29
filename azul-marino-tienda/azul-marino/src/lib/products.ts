import { supabaseServer } from "@/lib/supabase/server";
import type { Product } from "@/types";
export const SEED: Product[] = [
  { id:"s1", slug:"anillo-solitario-marea", name:"Anillo Solitario Marea", price:2480, category_id:"anillos", collection:"Marea", sku:"AM-RG-001", materials:"Oro 18k & topacio azul", description:"Pieza de la coleccion Marea, hecha a mano.", stock:6, type:"ring", gem:"#176B82", rating:5, featured:true },
  { id:"s2", slug:"collar-gota-de-mar", name:"Collar Gota de Mar", price:3190, category_id:"collares", collection:"Marea", sku:"AM-NK-002", materials:"Oro 18k & aguamarina", description:"Pieza de la coleccion Marea, hecha a mano.", stock:4, type:"necklace", gem:"#176B82", rating:5, featured:true },
  { id:"s3", slug:"aretes-solsticio", name:"Aretes Solsticio", price:1890, category_id:"aretes", collection:"Solsticio", sku:"AM-ER-003", materials:"Oro 18k & citrino", description:"Pieza de la coleccion Solsticio.", stock:9, type:"earrings", gem:"#C99A2E", rating:4, featured:true },
  { id:"s4", slug:"pulsera-abismo", name:"Pulsera Abismo", price:2750, category_id:"pulseras", collection:"Abismo", sku:"AM-BR-004", materials:"Oro blanco & zafiro", description:"Pieza de la coleccion Abismo.", stock:5, type:"bracelet", gem:"#0E2A3A", rating:5, featured:true },
];
export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const sb = supabaseServer();
    let q = sb.from("products").select("*").eq("active", true).order("created_at", { ascending: false });
    if (category && category !== "todos") q = q.eq("category_id", category);
    const { data } = await q;
    if (data && data.length) return data as Product[];
  } catch {}
  return category && category !== "todos" ? SEED.filter(p => p.category_id === category) : SEED;
}
export async function getProduct(slug: string): Promise<Product | null> {
  try { const sb = supabaseServer(); const { data } = await sb.from("products").select("*").eq("slug", slug).single(); if (data) return data as Product; } catch {}
  return SEED.find(p => p.slug === slug) || null;
}

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  const fallback = [{ id:"anillos",name:"Anillos" },{ id:"collares",name:"Collares" },{ id:"aretes",name:"Aretes" },{ id:"pulseras",name:"Pulseras" }];
  try { const sb = supabaseServer(); const { data } = await sb.from("categories").select("id,name").order("sort"); if (data && data.length) return data as any; } catch {}
  return fallback;
}
