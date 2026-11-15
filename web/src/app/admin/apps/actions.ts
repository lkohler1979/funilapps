"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

const APPS_DIR = path.join(process.cwd(), "public", "apps");
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

async function requireAdmin() {
  if (!(await isAuthenticated())) {
    throw new Error("Não autenticado");
  }
}

async function saveImageIfProvided(slug: string, formData: FormData) {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return null;

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : "jpg";
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(APPS_DIR, { recursive: true });
  await writeFile(path.join(APPS_DIR, `${slug}.${safeExt}`), buffer);

  return `/apps/${slug}.${safeExt}`;
}

export async function createApp(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceCents = Number(formData.get("priceCents"));
  const status = String(formData.get("status") ?? "draft");
  const accentColor = String(formData.get("accentColor") ?? "").trim() || null;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    redirect("/admin/apps/new?erro=slug");
  }
  if (!name || !category || !description || !Number.isFinite(priceCents)) {
    redirect("/admin/apps/new?erro=campos");
  }

  const imageUrl = await saveImageIfProvided(slug, formData);
  if (!imageUrl) {
    redirect("/admin/apps/new?erro=imagem");
  }

  const existing = await prisma.app.findUnique({ where: { slug } });
  if (existing) {
    redirect("/admin/apps/new?erro=duplicado");
  }

  await prisma.app.create({
    data: {
      slug,
      folderSlug: slug,
      name,
      category,
      description,
      priceCents,
      status,
      accentColor,
      imageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/apps");
  redirect("/admin/apps");
}

export async function updateAppAdmin(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  const priceCents = Number(formData.get("priceCents"));
  const accentColor = String(formData.get("accentColor") ?? "").trim() || null;

  const imageUrl = await saveImageIfProvided(slug, formData);

  await prisma.app.update({
    where: { id },
    data: {
      name,
      category,
      description,
      status,
      priceCents,
      accentColor,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/apps");
  redirect(`/admin/apps/${slug}?salvo=1`);
}

export async function addCombo(formData: FormData) {
  await requireAdmin();

  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));
  const relatedAppId = String(formData.get("relatedAppId"));
  const comboPriceCents = Number(formData.get("comboPriceCents"));

  if (!relatedAppId || relatedAppId === appId || !Number.isFinite(comboPriceCents)) {
    redirect(`/admin/apps/${slug}?erro=combo`);
  }

  const existing = await prisma.relatedApp.findFirst({
    where: {
      OR: [
        { appId, relatedAppId },
        { appId: relatedAppId, relatedAppId: appId },
      ],
    },
  });

  if (existing) {
    await prisma.relatedApp.update({
      where: { id: existing.id },
      data: { comboPriceCents },
    });
  } else {
    await prisma.relatedApp.create({
      data: { appId, relatedAppId, comboPriceCents },
    });
  }

  revalidatePath(`/${slug}`);
  revalidatePath(`/admin/apps/${slug}`);
  redirect(`/admin/apps/${slug}`);
}

export async function removeCombo(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));

  const relation = await prisma.relatedApp.findUnique({
    where: { id },
    include: { app: true, relatedApp: true },
  });

  await prisma.relatedApp.delete({ where: { id } });

  revalidatePath(`/${slug}`);
  revalidatePath(`/admin/apps/${slug}`);
  if (relation) {
    revalidatePath(`/${relation.app.slug}`);
    revalidatePath(`/${relation.relatedApp.slug}`);
  }
  redirect(`/admin/apps/${slug}`);
}
