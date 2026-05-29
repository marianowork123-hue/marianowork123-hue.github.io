"use client";
import React, { createContext, useContext, useState } from "react";
import type { Product, CartItem } from "@/types";

type Ctx = {
  items: CartItem[]; count: number; subtotal: number;
  add: (p: Product, n?: number) => void; dec: (id: string) => void; remove: (id: string) => void;
  open: boolean; setOpen: (v: boolean) => void;
};
const CartCtx = createContext<Ctx>(null as any);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const add = (p: Product, n = 1) => {
    setItems(c => { const f = c.find(i => i.id === p.id); return f ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + n } : i) : [...c, { ...p, qty: n }]; });
    setOpen(true);
  };
  const dec = (id: string) => setItems(c => c.flatMap(i => i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]));
  const remove = (id: string) => setItems(c => c.filter(i => i.id !== id));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  return <CartCtx.Provider value={{ items, count, subtotal, add, dec, remove, open, setOpen }}>{children}</CartCtx.Provider>;
}
