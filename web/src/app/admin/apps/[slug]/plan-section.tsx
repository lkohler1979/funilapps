import {
  addPlanDay,
  addPlanExercise,
  addPlanWeek,
  deletePlanDay,
  deletePlanExercise,
  deletePlanWeek,
  updatePlanExercise,
} from "../content-actions";

type ExerciseRow = {
  id: string;
  name: string;
  reps: string | null;
  desc: string | null;
  steps: string[];
  tip: string | null;
  order: number;
};
type DayRow = { id: string; name: string; order: number; exercises: ExerciseRow[] };
type WeekRow = { id: string; name: string; subtitle: string | null; order: number; days: DayRow[] };

export function PlanSection({
  appId,
  slug,
  weeks,
}: {
  appId: string;
  slug: string;
  weeks: WeekRow[];
}) {
  return (
    <section id="plano" className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Plano semanal ({weeks.length} semanas)
      </h2>

      <div className="flex flex-col gap-3">
        {weeks.map((week) => (
          <details key={week.id} className="rounded border border-black/[.08] p-3 dark:border-white/[.1]">
            <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
              {week.name} {week.subtitle && `— ${week.subtitle}`}
            </summary>

            <form action={deletePlanWeek} className="mt-2">
              <input type="hidden" name="id" value={week.id} />
              <input type="hidden" name="slug" value={slug} />
              <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                Remover semana
              </button>
            </form>

            <div className="mt-3 flex flex-col gap-2 pl-3">
              {week.days.map((day) => (
                <details key={day.id} className="rounded border border-black/[.08] p-2 dark:border-white/[.1]">
                  <summary className="cursor-pointer text-sm text-zinc-700 dark:text-zinc-300">
                    {day.name}
                  </summary>
                  <form action={deletePlanDay} className="mt-1">
                    <input type="hidden" name="id" value={day.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                      Remover dia
                    </button>
                  </form>

                  <div className="mt-2 flex flex-col gap-2 pl-3">
                    {day.exercises.map((ex) => (
                      <details key={ex.id} className="rounded border border-black/[.08] p-2 dark:border-white/[.1]">
                        <summary className="cursor-pointer text-xs text-zinc-700 dark:text-zinc-300">
                          {ex.name} {ex.reps ? `— ${ex.reps}` : ""}
                        </summary>
                        <form action={updatePlanExercise} className="mt-2 flex flex-col gap-1">
                          <input type="hidden" name="id" value={ex.id} />
                          <input type="hidden" name="slug" value={slug} />
                          <input
                            name="name"
                            defaultValue={ex.name}
                            required
                            placeholder="Nome"
                            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                          />
                          <input
                            name="reps"
                            defaultValue={ex.reps ?? ""}
                            placeholder="Repetições/tempo"
                            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                          />
                          <textarea
                            name="desc"
                            defaultValue={ex.desc ?? ""}
                            rows={2}
                            placeholder="Descrição"
                            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                          />
                          <textarea
                            name="steps"
                            defaultValue={ex.steps.join("\n")}
                            rows={3}
                            placeholder="Passos (um por linha)"
                            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                          />
                          <input
                            name="tip"
                            defaultValue={ex.tip ?? ""}
                            placeholder="Dica"
                            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                          />
                          <input type="hidden" name="order" value={ex.order} />
                          <button
                            type="submit"
                            className="self-start rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
                          >
                            Salvar
                          </button>
                        </form>
                        <form action={deletePlanExercise} className="mt-1">
                          <input type="hidden" name="id" value={ex.id} />
                          <input type="hidden" name="slug" value={slug} />
                          <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                            Remover exercício
                          </button>
                        </form>
                      </details>
                    ))}
                  </div>

                  <details className="mt-2 ml-3 rounded border border-dashed border-black/[.2] p-2 dark:border-white/[.2]">
                    <summary className="cursor-pointer text-xs font-medium text-black dark:text-zinc-50">
                      + Novo exercício
                    </summary>
                    <form action={addPlanExercise} className="mt-2 flex flex-col gap-1">
                      <input type="hidden" name="dayId" value={day.id} />
                      <input type="hidden" name="slug" value={slug} />
                      <input
                        name="name"
                        required
                        placeholder="Nome"
                        className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                      />
                      <input
                        name="reps"
                        placeholder="Repetições/tempo"
                        className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                      />
                      <textarea
                        name="desc"
                        rows={2}
                        placeholder="Descrição"
                        className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                      />
                      <textarea
                        name="steps"
                        rows={3}
                        placeholder="Passos (um por linha)"
                        className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                      />
                      <input
                        name="tip"
                        placeholder="Dica"
                        className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                      />
                      <input type="hidden" name="order" value={day.exercises.length} />
                      <button
                        type="submit"
                        className="self-start rounded-full border border-black/[.12] px-3 py-1 text-xs font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
                      >
                        Adicionar
                      </button>
                    </form>
                  </details>
                </details>
              ))}
            </div>

            <details className="mt-2 ml-3 rounded border border-dashed border-black/[.2] p-2 dark:border-white/[.2]">
              <summary className="cursor-pointer text-xs font-medium text-black dark:text-zinc-50">
                + Novo dia
              </summary>
              <form action={addPlanDay} className="mt-2 flex gap-2">
                <input type="hidden" name="weekId" value={week.id} />
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="order" value={week.days.length} />
                <input
                  name="name"
                  required
                  placeholder="ex: Segunda - Respiração"
                  className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
                />
                <button
                  type="submit"
                  className="rounded-full border border-black/[.12] px-3 py-1 text-xs font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
                >
                  Adicionar
                </button>
              </form>
            </details>
          </details>
        ))}
      </div>

      <details className="mt-4 rounded border border-dashed border-black/[.2] p-3 dark:border-white/[.2]">
        <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
          + Nova semana
        </summary>
        <form action={addPlanWeek} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="appId" value={appId} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="order" value={weeks.length} />
          <input
            name="name"
            required
            placeholder="ex: Semana 5"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="subtitle"
            placeholder="Subtítulo"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <button
            type="submit"
            className="self-start rounded-full border border-black/[.12] px-4 py-1.5 text-xs font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
          >
            Adicionar
          </button>
        </form>
      </details>
    </section>
  );
}
