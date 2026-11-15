import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateApp } from "./actions";

export default async function AppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/[.08] bg-white px-6 py-8 dark:border-white/[.1] dark:bg-black sm:px-12">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← Voltar ao catálogo
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-black dark:text-zinc-50">
          {app.name}
        </h1>
        <p className="text-sm text-zinc-500">
          /{app.slug} · {app.category} ·{" "}
          {app.status === "published" ? "Publicado" : "Rascunho"}
        </p>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-12">
        <section className="mb-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
          <p className="text-zinc-700 dark:text-zinc-300">{app.description}</p>
        </section>

        <section className="rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
            Editar app
          </h2>
          <form action={updateApp} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={app.id} />
            <input type="hidden" name="slug" value={app.slug} />

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

            <button
              type="submit"
              className="mt-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Salvar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
