import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function ReelsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  const relations = await prisma.relatedApp.findMany({
    where: { OR: [{ appId: app.id }, { relatedAppId: app.id }] },
    include: { app: true, relatedApp: true },
  });
  const relatedApps = relations.map((r) =>
    r.appId === app.id ? r.relatedApp : r.app,
  );

  const extra = await prisma.app.findMany({
    where: {
      status: "published",
      id: { notIn: [app.id, ...relatedApps.map((a) => a.id)] },
    },
    orderBy: { name: "asc" },
    take: 6,
  });

  const suggestions = [...relatedApps, ...extra];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        🎬 Outros apps que você vai gostar
      </h1>
      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((other) => (
          <Link
            key={other.id}
            href={`/${other.slug}`}
            className="overflow-hidden rounded-lg border border-black/[.08] bg-white transition-colors hover:border-black/[.2] dark:border-white/[.1] dark:bg-zinc-950 dark:hover:border-white/[.3]"
          >
            <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={other.imageUrl ?? `/apps/${other.slug}.jpg`}
                alt={other.name}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-black dark:text-zinc-50">
                {other.name}
              </p>
              <p className="text-xs text-zinc-500">{formatCents(other.priceCents)}</p>
            </div>
          </Link>
        ))}
        {suggestions.length === 0 && (
          <p className="col-span-2 text-sm text-zinc-500">
            Nenhuma sugestão disponível no momento.
          </p>
        )}
      </div>
    </div>
  );
}
