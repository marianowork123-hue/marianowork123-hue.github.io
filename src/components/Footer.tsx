import React from "react";
import Link from "next/link";
import { Instagram, MessageCircle, Mail } from "lucide-react";
const GOLD = "#C99A2E";
export default function Footer({ tagline, categories, whatsapp }: { tagline: string; categories: { id: string; name: string }[]; whatsapp: string }) {
  return (
    <footer className="ftr">
      <div className="ftr-top">
        <div className="ftr-brand">
          <div className="brand"><svg width="30" height="22" viewBox="0 0 60 46"><path d="M14 12 L30 4 L46 12 L46 14 L30 30 L14 14 Z" fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" /><path d="M22 12 L30 4 L38 12 L30 18 Z" fill="#176B82" /></svg><span className="wordmark">AZUL MARINO</span></div>
          <p className="muted">{tagline}</p>
          <div className="ftr-social"><a href="#"><Instagram size={18} /></a><a href={`https://wa.me/${whatsapp}`}><MessageCircle size={18} /></a><a href="#"><Mail size={18} /></a></div>
        </div>
        <div className="ftr-col"><h4>Tienda</h4>{categories.map(c => <Link key={c.id} href={`/tienda?cat=${c.id}`}>{c.name}</Link>)}<Link href="/tienda">Todas las piezas</Link></div>
        <div className="ftr-col"><h4>Ayuda</h4><Link href="/contacto">Contacto</Link><Link href="/faq">Preguntas frecuentes</Link><Link href="/envios">Envíos</Link></div>
        <div className="ftr-col"><h4>Legal</h4><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos</Link><Link href="/devoluciones">Devoluciones</Link></div>
      </div>
      <div className="ftr-bottom"><span>© {new Date().getFullYear()} Azul Marino Joyería</span><span>Pagos seguros con tarjeta</span></div>
    </footer>
  );
}
