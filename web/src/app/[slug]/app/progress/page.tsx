import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBuyerEmail } from "@/lib/buyer";

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

  const [phraseRows, labelRows, totalExercises, buyerEmail] = await Promise.all([
    prisma.progressPhrase.findMany({ where: { appId: app.id }, orderBy: { order: "asc" } }),
    prisma.appLabel.findMany({ where: { appId: app.id } }),
    prisma.planExercise.count({ where: { day: { week: { appId: app.id } } } }),
    getBuyerEmail(),
  ]);

  const phrases = phraseRows.map((p) => p.text);
  const labels = Object.fromEntries(labelRows.map((l) => [l.key, l.value]));

  let doneCount = 0;
  let quizResult: { score: number; total: number } | null = null;

  if (buyerEmail) {
    const [exerciseCount, quizRow] = await Promise.all([
      prisma.userProgress.count({
        where: { email: buyerEmail, appId: app.id, kind: "exercise" },
      }),
      prisma.userProgress.findUnique({
        where: {
          email_appId_kind_key: {
            email: buyerEmail,
            appId: app.id,
            kind: "quiz",
            key: "latest",
          },
        },
      }),
    ]);
    doneCount = exerciseCount;
    quizResult = (quizRow?.value as { score: number; total: number } | null) ?? null;
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        🔥 {labels.ofensivaHome ?? "Seu progresso"}
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.1] dark:bg-zinc-950">
          <p className="text-xs text-zinc-500">
            {labels.exerciciosFeitos ?? "Concluídos"}
          </p>
          <p className="text-xl font-semibold text-black dark:text-zinc-50">
            {doneCount}
            {totalExercises > 0 && (
              <span className="text-sm font-normal text-zinc-500">
                {" "}
                / {totalExercises}
              </span>
            )}
          </p>
        </div>
        <div className="rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.1] dark:bg-zinc-950">
          <p className="text-xs text-zinc-500">Último quiz</p>
          <p className="text-xl font-semibold text-black dark:text-zinc-50">
            {quizResult ? `${quizResult.score}/${quizResult.total}` : "—"}
          </p>
        </div>
      </div>

      {!buyerEmail && (
        <p className="mb-6 text-sm text-zinc-500">
          Faça login com o e-mail da compra para salvar seu progresso entre
          dispositivos.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {phrases.map((phrase, i) => (
          <p
            key={i}
            className="rounded-lg border border-black/[.08] bg-white p-4 text-sm text-zinc-700 dark:border-white/[.1] dark:bg-zinc-950 dark:text-zinc-300"
          >
            {phrase}
          </p>
        ))}
      </div>
    </div>
  );
}
