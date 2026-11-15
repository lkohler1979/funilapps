import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { getBuyerEmail, hasAccessToApp } from "@/lib/buyer";
import { formatCents } from "@/lib/pricing";
import { logout } from "@/app/login/actions";
import { createAppCheckout, unlockWithEmail } from "@/app/checkout/actions";
import { updateApp } from "./actions";

export const dynamic = "force-dynamic";

export default async function AppPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ desbloqueado?: string; erro?: string }>;
}) {
  const { slug } = await params;
  const { desbloqueado, erro } = await searchParams;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  const authenticated = await isAuthenticated();
  const buyerEmail = await getBuyerEmail();
  const purchased = buyerEmail ? await hasAccessToApp(buyerEmail, app.id) : false;
  const unlocked = authenticated || purchased;

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
        <div className="mt-2">
          {authenticated ? (
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Sair
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Login para editar
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-12">
        <div className="relative mb-6 aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={`/apps/${app.slug}.jpg`}
            alt={app.name}
            fill
            sizes="320px"
            className="object-cover"
            priority
          />
        </div>

        {desbloqueado && (
          <p className="mb-6 rounded-lg border border-green-600/30 bg-green-50 p-4 text-sm text-green-800 dark:border-green-400/30 dark:bg-green-950 dark:text-green-300">
            Compra confirmada! Acesso liberado neste navegador.
          </p>
        )}

        {unlocked ? (
          <section className="mb-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
            <p className="text-zinc-700 dark:text-zinc-300">{app.description}</p>
          </section>
        ) : (
          <section className="mb-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
            <p className="text-zinc-700 dark:text-zinc-300">
              {app.description.slice(0, 90)}…
            </p>

            <div className="mt-6 flex flex-col gap-3 border-t border-black/[.08] pt-6 dark:border-white/[.1]">
              <p className="text-lg font-semibold text-black dark:text-zinc-50">
                {formatCents(app.priceCents)}
              </p>

              <form action={createAppCheckout.bind(null, app.slug)}>
                <button
                  type="submit"
                  className="w-full rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                >
                  Comprar acesso
                </button>
              </form>

              <Link
                href="/"
                className="text-center text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Ver oferta do pacote completo (36 apps)
              </Link>

              <details className="mt-2 text-sm text-zinc-500" open={Boolean(erro)}>
                <summary className="cursor-pointer">Já comprei</summary>
                <form
                  action={unlockWithEmail}
                  className="mt-3 flex flex-col gap-2"
                >
                  <input type="hidden" name="slug" value={app.slug} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="seu-email@exemplo.com"
                    className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
                  />
                  <button
                    type="submit"
                    className="rounded-full border border-black/[.12] px-5 py-2 text-sm font-medium text-black transition-colors hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
                  >
                    Desbloquear com e-mail
                  </button>
                  {erro === "naoencontrado" && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Nenhuma compra encontrada com esse e-mail.
                    </p>
                  )}
                  {erro === "email" && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Informe um e-mail.
                    </p>
                  )}
                </form>
              </details>
            </div>
          </section>
        )}

        {authenticated && (
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
        )}
      </main>
    </div>
  );
}
