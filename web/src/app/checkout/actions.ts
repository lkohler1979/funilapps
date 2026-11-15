"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { setBuyerCookie } from "@/lib/buyer";
import { BUNDLE_PRICE_CENTS } from "@/lib/pricing";

async function getSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  const headerList = await headers();
  const host = headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function createAppCheckout(slug: string) {
  const app = await prisma.app.findUnique({ where: { slug } });
  if (!app) {
    throw new Error("App não encontrado");
  }

  const siteUrl = await getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: app.priceCents,
          product_data: { name: app.name },
        },
        quantity: 1,
      },
    ],
    metadata: { type: "app", appId: app.id, slug: app.slug },
    success_url: `${siteUrl}/api/checkout/callback?session_id={CHECKOUT_SESSION_ID}&slug=${app.slug}`,
    cancel_url: `${siteUrl}/${app.slug}`,
  });

  if (!session.url) {
    throw new Error("Stripe não retornou URL de checkout");
  }

  redirect(session.url);
}

export async function createBundleCheckout() {
  const siteUrl = await getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: BUNDLE_PRICE_CENTS,
          product_data: { name: "Pacote completo — 36 apps FunilApp" },
        },
        quantity: 1,
      },
    ],
    metadata: { type: "bundle" },
    success_url: `${siteUrl}/api/checkout/callback?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/`,
  });

  if (!session.url) {
    throw new Error("Stripe não retornou URL de checkout");
  }

  redirect(session.url);
}

export async function unlockWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const slug = String(formData.get("slug") ?? "");

  if (!email) {
    redirect(`/${slug}?erro=email`);
  }

  const app = await prisma.app.findUnique({ where: { slug } });
  if (!app) {
    redirect(`/${slug}`);
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      email,
      status: "paid",
      OR: [{ type: "bundle" }, { type: "app", appId: app.id }],
    },
  });

  if (!purchase) {
    redirect(`/${slug}?erro=naoencontrado`);
  }

  await setBuyerCookie(email);
  redirect(`/${slug}?desbloqueado=1`);
}
