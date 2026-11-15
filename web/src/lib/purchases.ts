import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function recordPaidSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return null;

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) return null;

  const type = session.metadata?.type === "bundle" ? "bundle" : "app";
  const appId = type === "app" ? session.metadata?.appId ?? null : null;

  return prisma.purchase.upsert({
    where: { stripeSessionId: session.id },
    create: {
      email,
      type,
      appId,
      amountCents: session.amount_total ?? 0,
      stripeSessionId: session.id,
      status: "paid",
    },
    update: {
      status: "paid",
      email,
    },
  });
}
