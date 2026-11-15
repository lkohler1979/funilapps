import { updateAppJsonField } from "../content-actions";

export function JsonEditor({
  appId,
  slug,
  field,
  title,
  value,
  erro,
}: {
  appId: string;
  slug: string;
  field: "weeklyPlan" | "quiz" | "diagnostico";
  title: string;
  value: unknown;
  erro?: string;
}) {
  const text = value ? JSON.stringify(value, null, 2) : "";

  return (
    <section
      id={field}
      className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950"
    >
      <h2 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
        {title}
      </h2>
      <p className="mb-4 text-xs text-zinc-500">
        Edição avançada em JSON. Cuidado: salvar um JSON inválido é recusado.
      </p>
      {erro === "json" && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">
          JSON inválido — nada foi salvo.
        </p>
      )}
      <form action={updateAppJsonField} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={appId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="field" value={field} />
        <textarea
          name="value"
          defaultValue={text}
          rows={14}
          spellCheck={false}
          className="rounded border border-black/[.12] bg-transparent px-3 py-2 font-mono text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
        />
        <button
          type="submit"
          className="self-start rounded-full border border-black/[.12] px-4 py-2 text-sm font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
        >
          Salvar {title}
        </button>
      </form>
    </section>
  );
}
