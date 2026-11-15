import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { recordPaidSession } from "@/lib/purchases";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Webhook não configurado" },
      { status: 400 },
    );
  }

  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await recordPaidSession(event.data.object);
  }

  return NextResponse.json({ received: true });
}
