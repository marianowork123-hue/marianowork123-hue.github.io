import { supabaseServer } from "@/lib/supabase/server";
export const DEFAULT_CONTENT: Record<string, string> = {
  announcement: "Envio gratis en pedidos superiores a $1,500 · Piezas hechas a mano · Garantia de por vida",
  hero_eyebrow: "Joyeria de autor · Hecha a mano",
  hero_title: "El mar y la luz,\nen cada pieza.",
  hero_subtitle: "Oro de 18 quilates y gemas seleccionadas a mano. Joyas pensadas para durar generaciones, no temporadas.",
  about_title: "Hecho a mano, hecho para durar",
  about_text: "Azul Marino nace del oficio de la orfebreria tradicional y la obsesion por el detalle. Cada pieza se disena, funde y pule a mano en nuestro taller.",
  newsletter_title: "Se el primero en ver cada coleccion",
  footer_tagline: "Joyeria de autor hecha a mano. Oro 18k y gemas de origen responsable.",
  whatsapp: "521234567890",
};
export async function getContent(): Promise<Record<string, string>> {
  try {
    const sb = supabaseServer();
    const { data } = await sb.from("site_content").select("key,value");
    if (!data || data.length === 0) return DEFAULT_CONTENT;
    const map = { ...DEFAULT_CONTENT };
    data.forEach((r: any) => { if (r.value != null) map[r.key] = r.value; });
    return map;
  } catch { return DEFAULT_CONTENT; }
}
