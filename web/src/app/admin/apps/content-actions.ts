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

  const progressPhrases = String(formData.get("progressPhrases") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const ebookFeatures = String(formData.get("ebookFeatures") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon, ...rest] = line.split("|").map((s) => s.trim());
      return rest.length ? { icon: icon || null, text: rest.join("|").trim() } : { icon: null, text: icon };
    });

  await prisma.app.update({
    where: { id },
    data: { tagline, heroBadge, heroTitle, ebookTitle, ebookSubtitle, ebookPdfUrl },
  });

  await prisma.progressPhrase.deleteMany({ where: { appId: id } });
  if (progressPhrases.length) {
    await prisma.progressPhrase.createMany({
      data: progressPhrases.map((text, i) => ({ appId: id, text, order: i })),
    });
  }

  await prisma.ebookFeature.deleteMany({ where: { appId: id } });
  if (ebookFeatures.length) {
    await prisma.ebookFeature.createMany({
      data: ebookFeatures.map((f, i) => ({ appId: id, icon: f.icon, text: f.text, order: i })),
    });
  }

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}?salvo=1`);
}

// --- Diagnóstico: textos simples ---

export async function updateDiagnosticoTexts(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));

  await prisma.app.update({
    where: { id },
    data: {
      diagnosticoBoaNoticia: String(formData.get("diagnosticoBoaNoticia") ?? "").trim() || null,
      diagnosticoPlanoTitulo: String(formData.get("diagnosticoPlanoTitulo") ?? "").trim() || null,
      diagnosticoPlanoTexto: String(formData.get("diagnosticoPlanoTexto") ?? "").trim() || null,
    },
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

// --- Quiz ---

function parseOptions(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function findCorrectIndex(options: string[], correctText: string) {
  const idx = options.findIndex(
    (o) => o.trim().toLowerCase() === correctText.trim().toLowerCase(),
  );
  return idx >= 0 ? idx : 0;
}

export async function addQuizQuestion(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));
  const options = parseOptions(String(formData.get("options") ?? ""));

  await prisma.quizQuestion.create({
    data: {
      appId,
      category: String(formData.get("category") ?? "").trim() || null,
      difficulty: String(formData.get("difficulty") ?? "").trim() || null,
      question: String(formData.get("question") ?? "").trim(),
      options,
      correct: findCorrectIndex(options, String(formData.get("correctText") ?? "")),
      explanation: String(formData.get("explanation") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#quiz`);
}

export async function updateQuizQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const options = parseOptions(String(formData.get("options") ?? ""));

  await prisma.quizQuestion.update({
    where: { id },
    data: {
      category: String(formData.get("category") ?? "").trim() || null,
      difficulty: String(formData.get("difficulty") ?? "").trim() || null,
      question: String(formData.get("question") ?? "").trim(),
      options,
      correct: findCorrectIndex(options, String(formData.get("correctText") ?? "")),
      explanation: String(formData.get("explanation") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#quiz`);
}

export async function deleteQuizQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.quizQuestion.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#quiz`);
}

// --- Diagnóstico: perguntas e opções ---

export async function addDiagnosticQuestion(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));
  const titulo = String(formData.get("titulo") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  const lines = String(formData.get("opcoes") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const question = await prisma.diagnosticQuestion.create({
    data: { appId, titulo, order },
  });

  if (lines.length) {
    await prisma.diagnosticOption.createMany({
      data: lines.map((line, i) => {
        const [texto, descricao, valor] = line.split("|").map((s) => s.trim());
        return {
          questionId: question.id,
          texto: texto ?? line,
          descricao: descricao || null,
          valor: valor ? Number(valor) || null : null,
          order: i,
        };
      }),
    });
  }

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#diagnostico`);
}

export async function updateDiagnosticQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const titulo = String(formData.get("titulo") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  const lines = String(formData.get("opcoes") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  await prisma.diagnosticQuestion.update({ where: { id }, data: { titulo, order } });
  await prisma.diagnosticOption.deleteMany({ where: { questionId: id } });
  if (lines.length) {
    await prisma.diagnosticOption.createMany({
      data: lines.map((line, i) => {
        const [texto, descricao, valor] = line.split("|").map((s) => s.trim());
        return {
          questionId: id,
          texto: texto ?? line,
          descricao: descricao || null,
          valor: valor ? Number(valor) || null : null,
          order: i,
        };
      }),
    });
  }

  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#diagnostico`);
}

export async function deleteDiagnosticQuestion(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.diagnosticQuestion.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#diagnostico`);
}

// --- Diagnóstico: alertas ---

export async function addDiagnosticAlert(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));
  await prisma.diagnosticAlert.create({
    data: {
      appId,
      text: String(formData.get("text") ?? "").trim(),
      order: Number(formData.get("order") ?? 0),
    },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#diagnostico`);
}

export async function deleteDiagnosticAlert(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.diagnosticAlert.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#diagnostico`);
}

// --- Diagnóstico: métricas ---

export async function addDiagnosticMetric(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));
  await prisma.diagnosticMetric.create({
    data: {
      appId,
      n: String(formData.get("n") ?? "").trim(),
      de: String(formData.get("de") ?? "").trim(),
      para: String(formData.get("para") ?? "").trim(),
      order: Number(formData.get("order") ?? 0),
    },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#diagnostico`);
}

export async function deleteDiagnosticMetric(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.diagnosticMetric.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#diagnostico`);
}

// --- Plano semanal: semanas, dias, exercícios ---

export async function addPlanWeek(formData: FormData) {
  await requireAdmin();
  const appId = String(formData.get("appId"));
  const slug = String(formData.get("slug"));
  await prisma.planWeek.create({
    data: {
      appId,
      name: String(formData.get("name") ?? "").trim(),
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#plano`);
}

export async function deletePlanWeek(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.planWeek.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#plano`);
}

export async function addPlanDay(formData: FormData) {
  await requireAdmin();
  const weekId = String(formData.get("weekId"));
  const slug = String(formData.get("slug"));
  await prisma.planDay.create({
    data: {
      weekId,
      name: String(formData.get("name") ?? "").trim(),
      order: Number(formData.get("order") ?? 0),
    },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#plano`);
}

export async function deletePlanDay(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.planDay.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#plano`);
}

export async function addPlanExercise(formData: FormData) {
  await requireAdmin();
  const dayId = String(formData.get("dayId"));
  const slug = String(formData.get("slug"));
  const steps = String(formData.get("steps") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  await prisma.planExercise.create({
    data: {
      dayId,
      name: String(formData.get("name") ?? "").trim(),
      reps: String(formData.get("reps") ?? "").trim() || null,
      desc: String(formData.get("desc") ?? "").trim() || null,
      steps,
      tip: String(formData.get("tip") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#plano`);
}

export async function updatePlanExercise(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const steps = String(formData.get("steps") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  await prisma.planExercise.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? "").trim(),
      reps: String(formData.get("reps") ?? "").trim() || null,
      desc: String(formData.get("desc") ?? "").trim() || null,
      steps,
      tip: String(formData.get("tip") ?? "").trim() || null,
      order: Number(formData.get("order") ?? 0),
    },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#plano`);
}

export async function deletePlanExercise(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.planExercise.delete({ where: { id } });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#plano`);
}

// --- Navegação (menu) e labels (textos) ---

export async function updateNavItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.navItem.update({
    where: { id },
    data: { label: String(formData.get("label") ?? "").trim() },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#menu`);
}

export async function updateAppLabel(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  await prisma.appLabel.update({
    where: { id },
    data: { value: String(formData.get("value") ?? "") },
  });
  revalidateApp(slug);
  redirect(`/admin/apps/${slug}#menu`);
}
