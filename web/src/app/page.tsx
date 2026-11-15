import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const apps = await prisma.app.findMany({
    orderBy: { name: "asc" },
  });

  const categories = Array.from(new Set(apps.map((app) => app.category))).sort();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/[.08] bg-white px-6 py-10 dark:border-white/[.1] dark:bg-black sm:px-12">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          FunilApp
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Catálogo de {apps.length} apps standalone, prontos para serem usados em
          conjunto ou vendidos separadamente.
        </p>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-12">
        {categories.map((category) => (
          <section key={category} className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apps
                .filter((app) => app.category === category)
                .map((app) => (
                  <Link
                    key={app.id}
                    href={`/${app.slug}`}
                    className="block rounded-lg border border-black/[.08] bg-white p-4 transition-colors hover:border-black/[.2] dark:border-white/[.1] dark:bg-zinc-950 dark:hover:border-white/[.3]"
                  >
                    <h3 className="font-medium text-black dark:text-zinc-50">
                      {app.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {app.description}
                    </p>
                    <span className="mt-2 inline-block text-xs text-zinc-400">
                      {app.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}

        {apps.length === 0 && (
          <p className="text-zinc-600 dark:text-zinc-400">
            Nenhum app cadastrado ainda. Rode o seed do Prisma para popular o
            catálogo.
          </p>
        )}
      </main>
    </div>
  );
}
