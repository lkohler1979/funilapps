import {
  addDiagnosticAlert,
  addDiagnosticMetric,
  addDiagnosticQuestion,
  deleteDiagnosticAlert,
  deleteDiagnosticMetric,
  deleteDiagnosticQuestion,
  updateDiagnosticoTexts,
  updateDiagnosticQuestion,
} from "../content-actions";

type OptionRow = { id: string; texto: string; descricao: string | null; valor: number | null; order: number };
type QuestionRow = { id: string; titulo: string; order: number; opcoes: OptionRow[] };
type AlertRow = { id: string; text: string; order: number };
type MetricRow = { id: string; n: string; de: string; para: string; order: number };

function optionsToText(opcoes: OptionRow[]) {
  return opcoes
    .map((o) => [o.texto, o.descricao ?? "", o.valor ?? ""].join(" | "))
    .join("\n");
}

export function DiagnosticoSection({
  app,
  questions,
  alerts,
  metrics,
}: {
  app: {
    id: string;
    slug: string;
    diagnosticoBoaNoticia: string | null;
    diagnosticoPlanoTitulo: string | null;
    diagnosticoPlanoTexto: string | null;
  };
  questions: QuestionRow[];
  alerts: AlertRow[];
  metrics: MetricRow[];
}) {
  const slug = app.slug;

  return (
    <section id="diagnostico" className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Diagnóstico
      </h2>

      <form action={updateDiagnosticoTexts} className="mb-6 flex flex-col gap-2 border-b border-black/[.08] pb-6 dark:border-white/[.1]">
        <input type="hidden" name="id" value={app.id} />
        <input type="hidden" name="slug" value={slug} />
        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Boa notícia (texto de transição)
          <textarea
            name="diagnosticoBoaNoticia"
            defaultValue={app.diagnosticoBoaNoticia ?? ""}
            rows={2}
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Título do plano
          <input
            name="diagnosticoPlanoTitulo"
            defaultValue={app.diagnosticoPlanoTitulo ?? ""}
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Texto do plano
          <textarea
            name="diagnosticoPlanoTexto"
            defaultValue={app.diagnosticoPlanoTexto ?? ""}
            rows={3}
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Salvar textos
        </button>
      </form>

      <h3 className="mb-2 text-sm font-semibold text-black dark:text-zinc-50">
        Perguntas ({questions.length})
      </h3>
      <p className="mb-3 text-xs text-zinc-500">
        Opções: uma por linha, no formato "texto | descrição | valor".
      </p>
      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <details key={q.id} className="rounded border border-black/[.08] p-3 dark:border-white/[.1]">
            <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
              {q.titulo}
            </summary>
            <form action={updateDiagnosticQuestion} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={q.id} />
              <input type="hidden" name="slug" value={slug} />
              <input
                name="titulo"
                defaultValue={q.titulo}
                required
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <textarea
                name="opcoes"
                defaultValue={optionsToText(q.opcoes)}
                rows={4}
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 font-mono text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input type="hidden" name="order" value={q.order} />
              <button
                type="submit"
                className="self-start rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Salvar
              </button>
            </form>
            <form action={deleteDiagnosticQuestion} className="mt-2">
              <input type="hidden" name="id" value={q.id} />
              <input type="hidden" name="slug" value={slug} />
              <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                Remover pergunta
              </button>
            </form>
          </details>
        ))}
      </div>
      <details className="mt-3 rounded border border-dashed border-black/[.2] p-3 dark:border-white/[.2]">
        <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
          + Nova pergunta
        </summary>
        <form action={addDiagnosticQuestion} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="appId" value={app.id} />
          <input type="hidden" name="slug" value={slug} />
          <input
            name="titulo"
            required
            placeholder="Título da pergunta"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <textarea
            name="opcoes"
            rows={4}
            placeholder={"texto | descrição | valor\ntexto 2 | descrição 2 | valor"}
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 font-mono text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
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

      <h3 className="mb-2 mt-6 text-sm font-semibold text-black dark:text-zinc-50">
        Alertas ({alerts.length})
      </h3>
      <div className="flex flex-col gap-2">
        {alerts.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded border border-black/[.08] p-2 text-sm dark:border-white/[.1]">
            <span>{a.text}</span>
            <form action={deleteDiagnosticAlert}>
              <input type="hidden" name="id" value={a.id} />
              <input type="hidden" name="slug" value={slug} />
              <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                Remover
              </button>
            </form>
          </div>
        ))}
      </div>
      <form action={addDiagnosticAlert} className="mt-2 flex gap-2">
        <input type="hidden" name="appId" value={app.id} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="order" value={alerts.length} />
        <input
          name="text"
          required
          placeholder="Novo alerta"
          className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
        />
        <button
          type="submit"
          className="rounded-full border border-black/[.12] px-4 py-1.5 text-xs font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
        >
          Adicionar
        </button>
      </form>

      <h3 className="mb-2 mt-6 text-sm font-semibold text-black dark:text-zinc-50">
        Métricas ({metrics.length})
      </h3>
      <div className="flex flex-col gap-2">
        {metrics.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded border border-black/[.08] p-2 text-sm dark:border-white/[.1]">
            <span>{m.n}: {m.de} → {m.para}</span>
            <form action={deleteDiagnosticMetric}>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="slug" value={slug} />
              <button type="submit" className="text-xs text-red-600 hover:underline dark:text-red-400">
                Remover
              </button>
            </form>
          </div>
        ))}
      </div>
      <form action={addDiagnosticMetric} className="mt-2 flex gap-2">
        <input type="hidden" name="appId" value={app.id} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="order" value={metrics.length} />
        <input name="n" required placeholder="Nome" className="w-1/3 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50" />
        <input name="de" required placeholder="De" className="w-1/3 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50" />
        <input name="para" required placeholder="Para" className="w-1/3 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50" />
        <button
          type="submit"
          className="rounded-full border border-black/[.12] px-4 py-1.5 text-xs font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
        >
          +
        </button>
      </form>
    </section>
  );
}
