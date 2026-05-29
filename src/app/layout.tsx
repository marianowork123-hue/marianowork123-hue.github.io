import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { CartProvider } from "@/components/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";
import { getCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Azul Marino Joyería — Joyas hechas a mano",
  description: "Joyería de autor en oro 18k y gemas seleccionadas a mano. Piezas pensadas para durar generaciones.",
  openGraph: { title: "Azul Marino Joyería", description: "Joyas hechas a mano en oro 18k.", type: "website" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const categories = await getCategories();
  return (
    <html lang="es">
      <body>
        <div className="am">
          <CartProvider>
            <div className="bar">{content.announcement}</div>
            <Header categories={categories} />
            {children}
            <Footer tagline={content.footer_tagline} categories={categories} whatsapp={content.whatsapp} />
          </CartProvider>
          <a className="fab" href={`https://wa.me/${content.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={24} /></a>
        </div>
      </body>
    </html>
  );
}
