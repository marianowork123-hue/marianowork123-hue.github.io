"use client";
import React from "react";
import { useCart } from "@/components/cart";
import type { Product } from "@/types";
export default function AddToCart({ product, label = "Añadir al carrito", block }: { product: Product; label?: string; block?: boolean }) {
  const { add } = useCart();
  return <button className={`btn ${block ? "block" : ""}`} onClick={() => add(product, 1)}>{label}</button>;
}
