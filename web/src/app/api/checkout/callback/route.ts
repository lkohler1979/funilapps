import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { setBuyerCookie } from "@/lib/buyer";
import { recordPaidSession } from "@/lib/purchases";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const slug = request.nextUrl.searchParams.get("slug");
  const siteUrl = request.nextUrl.origin;

  if (!sessionId) {
    return NextResponse.redirect(`${siteUrl}/`);
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    await recordPaidSession(session);
    const email = session.customer_details?.email;
    if (email) {
      await setBuyerCookie(email);
    }
  }

  const destination = slug ? `/${slug}?desbloqueado=1` : `/?desbloqueado=1`;
  return NextResponse.redirect(`${siteUrl}${destination}`);
}
