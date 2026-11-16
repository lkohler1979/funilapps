import {
  addQuizQuestion,
  deleteQuizQuestion,
  updateQuizQuestion,
} from "../content-actions";

type QuizRow = {
  id: string;
  category: string | null;
  difficulty: string | null;
  question: string;
  options: string[];
  correct: number;
  explanation: string | null;
  order: number;
};

export function QuizSection({
  appId,
  slug,
  questions,
}: {
  appId: string;
  slug: string;
  questions: QuizRow[];
}) {
  return (
    <section id="quiz" className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
        Quiz ({questions.length})
      </h2>
      <p className="mb-4 text-xs text-zinc-500">
        Opções: uma por linha. Resposta correta: cole o texto exato de uma das
        opções.
      </p>

      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <details
            key={q.id}
            className="rounded border border-black/[.08] p-3 dark:border-white/[.1]"
          >
            <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
              {q.question}
            </summary>
            <form action={updateQuizQuestion} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={q.id} />
              <input type="hidden" name="slug" value={slug} />
              <div className="flex gap-2">
                <input
                  name="category"
                  defaultValue={q.category ?? ""}
                  placeholder="Categoria"
                  className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
                />
                <input
                  name="difficulty"
                  defaultValue={q.difficulty ?? ""}
                  placeholder="Dificuldade"
                  className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
                />
              </div>
              <textarea
                name="question"
                defaultValue={q.question}
                required
                rows={2}
                placeholder="Pergunta"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <textarea
                name="options"
                defaultValue={q.options.join("\n")}
                required
                rows={4}
                placeholder="Opções (uma por linha)"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="correctText"
                defaultValue={q.options[q.correct] ?? ""}
                required
                placeholder="Resposta correta (texto exato de uma opção)"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <textarea
                name="explanation"
                defaultValue={q.explanation ?? ""}
                rows={2}
                placeholder="Explicação"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input type="hidden" name="order" value={q.order} />
              <button
                type="submit"
                className="self-start rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Salvar
              </button>
            </form>
            <form action={deleteQuizQuestion} className="mt-2">
              <input type="hidden" name="id" value={q.id} />
              <input type="hidden" name="slug" value={slug} />
              <button
                type="submit"
                className="text-xs text-red-600 hover:underline dark:text-red-400"
              >
                Remover pergunta
              </button>
            </form>
          </details>
        ))}
      </div>

      <details className="mt-4 rounded border border-dashed border-black/[.2] p-3 dark:border-white/[.2]">
        <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
          + Nova pergunta
        </summary>
        <form action={addQuizQuestion} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="appId" value={appId} />
          <input type="hidden" name="slug" value={slug} />
          <div className="flex gap-2">
            <input
              name="category"
              placeholder="Categoria"
              className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
            />
            <input
              name="difficulty"
              placeholder="Dificuldade"
              className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
            />
          </div>
          <textarea
            name="question"
            required
            rows={2}
            placeholder="Pergunta"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <textarea
            name="options"
            required
            rows={4}
            placeholder="Opções (uma por linha)"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="correctText"
            required
            placeholder="Resposta correta (texto exato de uma opção)"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <textarea
            name="explanation"
            rows={2}
            placeholder="Explicação"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input type="hidden" name="order" value={questions.length} />
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
