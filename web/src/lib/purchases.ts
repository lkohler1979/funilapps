import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function recordPaidSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return null;

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) return null;

  const type = session.metadata?.type === "combo" ? "combo" : "app";
  const appIds = (session.metadata?.appIds ?? "").split(",").filter(Boolean);
  if (appIds.length === 0) return null;

  return prisma.purchase.upsert({
    where: { stripeSessionId: session.id },
    create: {
      email,
      type,
      appIds,
      amountCents: session.amount_total ?? 0,
      stripeSessionId: session.id,
      status: "paid",
    },
    update: {
      status: "paid",
      email,
      appIds,
    },
  });
}
