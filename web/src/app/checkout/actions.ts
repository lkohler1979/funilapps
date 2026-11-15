"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { setBuyerCookie, hasAccessToApp } from "@/lib/buyer";

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
    metadata: { type: "app", appIds: app.id, slug: app.slug },
    success_url: `${siteUrl}/api/checkout/callback?session_id={CHECKOUT_SESSION_ID}&slug=${app.slug}`,
    cancel_url: `${siteUrl}/${app.slug}`,
  });

  if (!session.url) {
    throw new Error("Stripe não retornou URL de checkout");
  }

  redirect(session.url);
}

export async function createComboCheckout(relatedAppRowId: string) {
  const relation = await prisma.relatedApp.findUnique({
    where: { id: relatedAppRowId },
    include: { app: true, relatedApp: true },
  });
  if (!relation) {
    throw new Error("Combo não encontrado");
  }

  const siteUrl = await getSiteUrl();
  const returnSlug = relation.app.slug;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: relation.comboPriceCents,
          product_data: {
            name: `Combo: ${relation.app.name} + ${relation.relatedApp.name}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "combo",
      appIds: `${relation.appId},${relation.relatedAppId}`,
    },
    success_url: `${siteUrl}/api/checkout/callback?session_id={CHECKOUT_SESSION_ID}&slug=${returnSlug}`,
    cancel_url: `${siteUrl}/${returnSlug}`,
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

  const hasAccess = await hasAccessToApp(email, app.id);
  if (!hasAccess) {
    redirect(`/${slug}?erro=naoencontrado`);
  }

  await setBuyerCookie(email);
  redirect(`/${slug}?desbloqueado=1`);
}
