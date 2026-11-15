import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminAppsPage() {
  const apps = await prisma.app.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Apps</h1>
        <Link
          href="/admin/apps/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          + Novo app
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-black/[.08] dark:border-white/[.1]">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-left dark:bg-zinc-900">
            <tr>
              <th className="p-3 font-medium"></th>
              <th className="p-3 font-medium">Nome</th>
              <th className="p-3 font-medium">Categoria</th>
              <th className="p-3 font-medium">Preço</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id} className="border-t border-black/[.08] dark:border-white/[.1]">
                <td className="p-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={app.imageUrl ?? `/apps/${app.slug}.jpg`}
                      alt={app.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-3">{app.name}</td>
                <td className="p-3">{app.category}</td>
                <td className="p-3">{formatCents(app.priceCents)}</td>
                <td className="p-3">
                  {app.status === "published" ? "Publicado" : "Rascunho"}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/apps/${app.slug}`}
                    className="text-sm text-zinc-500 hover:text-black dark:hover:text-zinc-50"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
