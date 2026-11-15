import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBuyerEmail } from "@/lib/buyer";
import { ExerciseToggle } from "./exercise-toggle";

export const dynamic = "force-dynamic";

type Exercise = { name: string; reps?: string };
type ExerciseDetail = {
  desc?: string;
  steps?: string[];
  tip?: string;
};

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

  const plan = (app.weeklyPlan ?? {}) as {
    treinos?: Record<string, { subtitle?: string; [day: string]: unknown }>;
    exerciseDetails?: Record<string, ExerciseDetail>;
  };
  const weeks = plan.treinos ?? {};
  const details = plan.exerciseDetails ?? {};

  const labels = (app.labels ?? {}) as Record<string, string>;

  const buyerEmail = await getBuyerEmail();
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
        {Object.entries(weeks).map(([weekName, week]) => {
          const { subtitle, ...days } = week as {
            subtitle?: string;
            [day: string]: unknown;
          };
          return (
            <details
              key={weekName}
              className="rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.1] dark:bg-zinc-950"
            >
              <summary className="cursor-pointer font-medium text-black dark:text-zinc-50">
                {weekName}
                {subtitle && (
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    — {subtitle}
                  </span>
                )}
              </summary>

              <div className="mt-3 flex flex-col gap-3">
                {Object.entries(days).map(([dayName, exercises]) => (
                  <details key={dayName} className="pl-2">
                    <summary className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {dayName}
                    </summary>
                    <ul className="mt-2 flex flex-col gap-2 pl-3">
                      {(exercises as Exercise[]).map((ex, i) => {
                        const detail = details[ex.name] ?? null;
                        return (
                          <li key={i} className="text-sm">
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
                              {detail && (
                                <div className="mt-1 rounded bg-zinc-50 p-2 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                                  {detail.desc && <p className="mb-1">{detail.desc}</p>}
                                  {detail.steps && detail.steps.length > 0 && (
                                    <ol className="mb-1 list-decimal pl-4">
                                      {detail.steps.map((s, si) => (
                                        <li key={si}>{s}</li>
                                      ))}
                                    </ol>
                                  )}
                                  {detail.tip && (
                                    <p className="italic">💡 {detail.tip}</p>
                                  )}
                                </div>
                              )}
                            </details>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
