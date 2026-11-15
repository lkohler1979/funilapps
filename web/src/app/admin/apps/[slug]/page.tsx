import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/pricing";
import { addCombo, removeCombo, updateAppAdmin } from "../actions";
import { ContentForm } from "./content-form";
import { JsonEditor } from "./json-editor";
import { ArticlesSection } from "./articles-section";
import { VideosSection } from "./videos-section";
import { PodcastsSection } from "./podcasts-section";
import { NewsSection } from "./news-section";

export const dynamic = "force-dynamic";

export default async function EditAppPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ salvo?: string; erro?: string }>;
}) {
  const { slug } = await params;
  const { salvo, erro } = await searchParams;
  const app = await prisma.app.findUnique({
    where: { slug },
    include: {
      articles: { orderBy: { order: "asc" } },
      videoLessons: { orderBy: { order: "asc" } },
      podcasts: { orderBy: { order: "asc" } },
      newsItems: { orderBy: { order: "asc" } },
    },
  });

  if (!app) {
    notFound();
  }

  const [otherApps, relations] = await Promise.all([
    prisma.app.findMany({
      where: { id: { not: app.id } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.relatedApp.findMany({
      where: { OR: [{ appId: app.id }, { relatedAppId: app.id }] },
      include: { app: true, relatedApp: true },
    }),
  ]);

  const combos = relations.map((r) => ({
    id: r.id,
    otherApp: r.appId === app.id ? r.relatedApp : r.app,
    comboPriceCents: r.comboPriceCents,
  }));
  const relatedIds = new Set(combos.map((c) => c.otherApp.id));
  const selectableApps = otherApps.filter((a) => !relatedIds.has(a.id));

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Editar: {app.name}
      </h1>

      {salvo && (
        <p className="mb-4 rounded-lg border border-green-600/30 bg-green-50 p-3 text-sm text-green-800 dark:border-green-400/30 dark:bg-green-950 dark:text-green-300">
          Alterações salvas.
        </p>
      )}

      <form
        action={updateAppAdmin}
        className="flex flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950"
      >
        <input type="hidden" name="id" value={app.id} />
        <input type="hidden" name="slug" value={app.slug} />

        <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={app.imageUrl ?? `/apps/${app.slug}.jpg`}
            alt={app.name}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>

        <p className="text-xs text-zinc-500">/{app.slug} (não editável)</p>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Nome
          <input
            name="name"
            defaultValue={app.name}
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Categoria
          <input
            name="category"
            defaultValue={app.category}
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Descrição
          <textarea
            name="description"
            defaultValue={app.description}
            required
            rows={4}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Preço (centavos)
          <input
            name="priceCents"
            type="number"
            min={0}
            defaultValue={app.priceCents}
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Cor de destaque
          <input
            name="accentColor"
            type="color"
            defaultValue={app.accentColor ?? "#111827"}
            className="h-10 w-20 rounded border border-black/[.12] bg-transparent dark:border-white/[.15]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Status
          <select
            name="status"
            defaultValue={app.status}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Trocar imagem de capa (opcional)
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Salvar
        </button>
      </form>

      <section className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
          Apps relacionados (combo com desconto)
        </h2>

        {erro === "combo" && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">
            Selecione um app e um preço de combo válido.
          </p>
        )}

        <div className="mb-4 flex flex-col gap-2">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="flex items-center justify-between rounded border border-black/[.08] p-3 text-sm dark:border-white/[.1]"
            >
              <span>
                {app.name} + {combo.otherApp.name} ·{" "}
                {formatCents(combo.comboPriceCents)}
              </span>
              <form action={removeCombo}>
                <input type="hidden" name="id" value={combo.id} />
                <input type="hidden" name="slug" value={app.slug} />
                <button
                  type="submit"
                  className="text-red-600 hover:underline dark:text-red-400"
                >
                  Remover
                </button>
              </form>
            </div>
          ))}
          {combos.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhum combo configurado ainda.</p>
          )}
        </div>

        {selectableApps.length > 0 && (
          <form action={addCombo} className="flex flex-col gap-3 border-t border-black/[.08] pt-4 dark:border-white/[.1]">
            <input type="hidden" name="appId" value={app.id} />
            <input type="hidden" name="slug" value={app.slug} />

            <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              App relacionado
              <select
                name="relatedAppId"
                required
                className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
              >
                {selectableApps.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              Preço do combo (centavos)
              <input
                name="comboPriceCents"
                type="number"
                min={0}
                required
                placeholder="ex: 1499"
                className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
              />
            </label>

            <button
              type="submit"
              className="self-start rounded-full border border-black/[.12] px-4 py-2 text-sm font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
            >
              Adicionar combo
            </button>
          </form>
        )}
      </section>

      <ContentForm app={app} />

      <ArticlesSection appId={app.id} slug={app.slug} articles={app.articles} />

      <VideosSection appId={app.id} slug={app.slug} videos={app.videoLessons} />

      <PodcastsSection appId={app.id} slug={app.slug} podcasts={app.podcasts} />

      <NewsSection appId={app.id} slug={app.slug} news={app.newsItems} />

      <JsonEditor
        appId={app.id}
        slug={app.slug}
        field="weeklyPlan"
        title="Plano semanal (desafios)"
        value={app.weeklyPlan}
        erro={erro}
      />

      <JsonEditor
        appId={app.id}
        slug={app.slug}
        field="quiz"
        title="Quiz"
        value={app.quiz}
        erro={erro}
      />

      <JsonEditor
        appId={app.id}
        slug={app.slug}
        field="diagnostico"
        title="Diagnóstico"
        value={app.diagnostico}
        erro={erro}
      />
    </div>
  );
}
