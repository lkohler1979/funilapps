"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

async function requireAdmin() {
  if (!(await isAuthenticated())) {
    throw new Error("Não autenticado");
  }
}

function revalidateApp(slug: string) {
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/app`);
  revalidatePath(`/admin/apps/${slug}`);
}

// --- Conteúdo geral (hero, ebook, frases) ---

export async function updateAppContent(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug"));
  const id = String(formData.get("id"));
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const heroBadge = String(formData.get("heroBadge") ?? "").trim() || null;
  const heroTitle = String(formData.get("heroTitle") ?? "").trim() || null;
  const ebookTitle = String(formData.get("ebookTitle") ?? "").trim() || null;
  const ebookSubtitle = String(formData.get("ebookSubtitle") ?? "").trim() || null;
  const ebookPdfUrl = String(formData.get("ebookPdfUrl") ?? "").trim() || null;
  const progressPhrasesRaw = String(formData.get("progressPhrases") ?? "");
  const progressPhrases = progressPhrasesRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  await prisma.app.update({
    where: { id },
    data: {
      tagline,
      heroBadge,
      heroTitle,
      ebookTitle,
      ebookSubtitle,
      ebookPdfUrl,
      progressPhrases,
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}?salvo=1`);
}

// --- Blocos JSON avançados (plano semanal, quiz, diagnóstico) ---

export async function updateAppJsonField(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug"));
  const id = String(formData.get("id"));
  const field = String(formData.get("field"));
  const raw = String(formData.get("value") ?? "");

  if (!["weeklyPlan", "quiz", "diagnostico"].includes(field)) {
    throw new Error("Campo inválido");
  }

  let parsed: unknown;
  try {
    parsed = raw.trim() ? JSON.parse(raw) : null;
  } catch {
    redirect(`/admin/apps/${slug}?erro=json#${field}`);
  }

  await prisma.app.update({
    where: { id },
    data: { [field]: parsed as never },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}?salvo=1`);
}

// --- Artigos ---

export async function addArticle(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));

  await prisma.article.create({
    data: {
      appId,
      icon: String(formData.get("icon") ?? "").trim() || null,
      title: String(formData.get("title") ?? "").trim(),
      cardDesc: String(formData.get("cardDesc") ?? "").trim() || null,
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      content: String(formData.get("content") ?? ""),
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function updateArticle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));

  await prisma.article.update({
    where: { id },
    data: {
      icon: String(formData.get("icon") ?? "").trim() || null,
      title: String(formData.get("title") ?? "").trim(),
      cardDesc: String(formData.get("cardDesc") ?? "").trim() || null,
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      content: String(formData.get("content") ?? ""),
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.article.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

// --- Áudios (podcast) ---

export async function addPodcast(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));

  await prisma.podcast.create({
    data: {
      appId,
      title: String(formData.get("title") ?? "").trim(),
      duration: String(formData.get("duration") ?? "").trim() || null,
      url: String(formData.get("url") ?? "").trim(),
      free: formData.get("free") === "on",
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function updatePodcast(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));

  await prisma.podcast.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      duration: String(formData.get("duration") ?? "").trim() || null,
      url: String(formData.get("url") ?? "").trim(),
      free: formData.get("free") === "on",
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function deletePodcast(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.podcast.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

// --- Vídeos ---

export async function addVideo(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));

  await prisma.videoLesson.create({
    data: {
      appId,
      videoId: String(formData.get("videoId") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      num: String(formData.get("num") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function updateVideo(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));

  await prisma.videoLesson.update({
    where: { id },
    data: {
      videoId: String(formData.get("videoId") ?? "").trim(),
      title: String(formData.get("title") ?? "").trim(),
      num: String(formData.get("num") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function deleteVideo(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.videoLesson.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

// --- Notícias ---

export async function addNews(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));

  await prisma.newsItem.create({
    data: {
      appId,
      title: String(formData.get("title") ?? "").trim(),
      source: String(formData.get("source") ?? "").trim() || null,
      url: String(formData.get("url") ?? "").trim(),
      date: String(formData.get("date") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function updateNews(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));

  await prisma.newsItem.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? "").trim(),
      source: String(formData.get("source") ?? "").trim() || null,
      url: String(formData.get("url") ?? "").trim(),
      date: String(formData.get("date") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}

export async function deleteNews(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.newsItem.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}`);
}
