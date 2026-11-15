import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  const phrases = Array.isArray(app.progressPhrases)
    ? (app.progressPhrases as string[])
    : [];
  const labels = (app.labels ?? {}) as Record<string, string>;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        🔥 {labels.ofensivaHome ?? "Seu progresso"}
      </h1>

      <div className="flex flex-col gap-3">
        {phrases.map((phrase, i) => (
          <p
            key={i}
            className="rounded-lg border border-black/[.08] bg-white p-4 text-sm text-zinc-700 dark:border-white/[.1] dark:bg-zinc-950 dark:text-zinc-300"
          >
            {phrase}
          </p>
        ))}
        {phrases.length === 0 && (
          <p className="text-sm text-zinc-500">Continue firme — seu progresso aparece aqui.</p>
        )}
      </div>
    </div>
  );
}
