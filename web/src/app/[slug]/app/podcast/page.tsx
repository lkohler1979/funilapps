import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({
    where: { slug },
    include: { podcasts: { orderBy: { order: "asc" } } },
  });

  if (!app) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
        🎧 Áudios
      </h1>
      <div className="flex flex-col gap-4">
        {app.podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.1] dark:bg-zinc-950"
          >
            <p className="font-medium text-black dark:text-zinc-50">
              {podcast.title}
            </p>
            {podcast.duration && (
              <p className="mb-2 text-xs text-zinc-500">{podcast.duration}</p>
            )}
            <audio controls className="w-full" src={podcast.url} />
          </div>
        ))}
        {app.podcasts.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhum áudio disponível.</p>
        )}
      </div>
    </div>
  );
}
