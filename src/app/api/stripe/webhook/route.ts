import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook inválido: ${e.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s: any = event.data.object;
    try {
      const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      await admin.from("orders").insert({
        email: s.customer_details?.email,
        total: (s.amount_total || 0) / 100,
        status: "paid",
        stripe_session: s.id,
      });
    } catch (e) { console.error("No se pudo guardar el pedido:", e); }
  }
  return NextResponse.json({ received: true });
}
