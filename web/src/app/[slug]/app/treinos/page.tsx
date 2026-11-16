import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBuyerEmail } from "@/lib/buyer";
import { ExerciseToggle } from "./exercise-toggle";

export const dynamic = "force-dynamic";

export default async function TreinosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  const [weeks, labelRows, buyerEmail] = await Promise.all([
    prisma.planWeek.findMany({
      where: { appId: app.id },
      orderBy: { order: "asc" },
      include: {
        days: {
          orderBy: { order: "asc" },
          include: { exercises: { orderBy: { order: "asc" } } },
        },
      },
    }),
    prisma.appLabel.findMany({ where: { appId: app.id } }),
    getBuyerEmail(),
  ]);

  const labels = Object.fromEntries(labelRows.map((l) => [l.key, l.value]));

  const doneExercises = buyerEmail
    ? new Set(
        (
          await prisma.userProgress.findMany({
            where: { email: buyerEmail, appId: app.id, kind: "exercise" },
            select: { key: true },
          })
        ).map((p) => p.key),
      )
    : new Set<string>();

  return (
    <div>
      <h1
        className="mb-1 text-xl font-semibold text-black dark:text-zinc-50"
        dangerouslySetInnerHTML={{
          __html: labels.pageTreinos ?? "Meu Plano",
        }}
      />
      {labels.treinosSubtitle && (
        <p className="mb-6 text-sm text-zinc-500">{labels.treinosSubtitle}</p>
      )}

      <div className="flex flex-col gap-3">
        {weeks.map((week) => (
          <details
            key={week.id}
            className="rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.1] dark:bg-zinc-950"
          >
            <summary className="cursor-pointer font-medium text-black dark:text-zinc-50">
              {week.name}
              {week.subtitle && (
                <span className="ml-2 text-sm font-normal text-zinc-500">
                  — {week.subtitle}
                </span>
              )}
            </summary>

            <div className="mt-3 flex flex-col gap-3">
              {week.days.map((day) => (
                <details key={day.id} className="pl-2">
                  <summary className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {day.name}
                  </summary>
                  <ul className="mt-2 flex flex-col gap-2 pl-3">
                    {day.exercises.map((ex) => (
                      <li key={ex.id} className="text-sm">
                        <details>
                          <summary className="flex cursor-pointer items-center gap-2 text-zinc-700 dark:text-zinc-300">
                            <ExerciseToggle
                              slug={slug}
                              appId={app.id}
                              exerciseName={ex.name}
                              initialDone={doneExercises.has(ex.name)}
                            />
                            {ex.name}
                            {ex.reps ? ` — ${ex.reps}` : ""}
                          </summary>
                          {(ex.desc || ex.steps.length > 0 || ex.tip) && (
                            <div className="mt-1 rounded bg-zinc-50 p-2 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                              {ex.desc && <p className="mb-1">{ex.desc}</p>}
                              {ex.steps.length > 0 && (
                                <ol className="mb-1 list-decimal pl-4">
                                  {ex.steps.map((s, si) => (
                                    <li key={si}>{s}</li>
                                  ))}
                                </ol>
                              )}
                              {ex.tip && <p className="italic">💡 {ex.tip}</p>}
                            </div>
                          )}
                        </details>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
