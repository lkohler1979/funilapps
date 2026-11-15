"use server";

import { redirect } from "next/navigation";
import { checkCredentials, clearSessionCookie, setSessionCookie } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(email, password)) {
    redirect("/login?error=1");
  }

  await setSessionCookie();
  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}
