import { isAuthenticated } from "@/lib/auth";
import { getBuyerEmail, hasAccessToApp } from "@/lib/buyer";

export async function isUnlocked(appId: string) {
  const authenticated = await isAuthenticated();
  if (authenticated) return true;

  const buyerEmail = await getBuyerEmail();
  if (!buyerEmail) return false;

  return hasAccessToApp(buyerEmail, appId);
}
