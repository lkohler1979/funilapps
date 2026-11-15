import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "funilapp_buyer";
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 ano

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET não configurado");
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function readSignedEmail(value: string | undefined) {
  if (!value) return null;
  const separatorIndex = value.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const email = value.slice(0, separatorIndex);
  const signature = value.slice(separatorIndex + 1);
  const expected = sign(email);

  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (signatureBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(signatureBuf, expectedBuf)) return null;

  return email;
}

export async function getBuyerEmail() {
  const cookieStore = await cookies();
  return readSignedEmail(cookieStore.get(COOKIE_NAME)?.value);
}

export async function setBuyerCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, `${email}.${sign(email)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_TTL_SECONDS,
  });
}

export async function hasAccessToApp(email: string, appId: string) {
  const purchase = await prisma.purchase.findFirst({
    where: {
      email,
      status: "paid",
      appIds: { has: appId },
    },
    select: { id: true },
  });
  return purchase !== null;
}
