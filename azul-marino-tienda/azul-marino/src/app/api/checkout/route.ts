import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!items?.length) return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((i: any) => ({
        quantity: i.qty,
        price_data: { currency: "mxn", unit_amount: Math.round(Number(i.price) * 100), product_data: { name: i.name } },
      })),
      shipping_address_collection: { allowed_countries: ["MX", "US"] },
      success_url: `${site}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/cancelado`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Error de pago" }, { status: 500 });
  }
}
