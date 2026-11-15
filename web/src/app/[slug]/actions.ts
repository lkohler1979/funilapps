"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateApp(formData: FormData) {
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const name = String(formData.get("name"));
  const category = String(formData.get("category"));
  const description = String(formData.get("description"));
  const status = String(formData.get("status"));

  await prisma.app.update({
    where: { id },
    data: { name, category, description, status },
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/");
}
