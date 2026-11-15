import { updateAppContent } from "../content-actions";

export function ContentForm({
  app,
}: {
  app: {
    id: string;
    slug: string;
    tagline: string | null;
    heroBadge: string | null;
    heroTitle: string | null;
    ebookTitle: string | null;
    ebookSubtitle: string | null;
    ebookPdfUrl: string | null;
    progressPhrases: unknown;
  };
}) {
  const phrases = Array.isArray(app.progressPhrases)
    ? (app.progressPhrases as string[])
    : [];

  return (
    <section className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Conteúdo do app — Início e E-book
      </h2>
      <form action={updateAppContent} className="flex flex-col gap-4">
        <input type="hidden" name="id" value={app.id} />
        <input type="hidden" name="slug" value={app.slug} />

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Selo (badge) do início
          <input
            name="heroBadge"
            defaultValue={app.heroBadge ?? ""}
            placeholder="ex: VENCEDOR"
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Título do início (aceita HTML simples, ex: {"<span>destaque</span>"})
          <input
            name="heroTitle"
            defaultValue={app.heroTitle ?? ""}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Frase curta (tagline)
          <input
            name="tagline"
            defaultValue={app.tagline ?? ""}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Título do e-book
          <input
            name="ebookTitle"
            defaultValue={app.ebookTitle ?? ""}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Subtítulo do e-book
          <input
            name="ebookSubtitle"
            defaultValue={app.ebookSubtitle ?? ""}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Link do PDF do e-book
          <input
            name="ebookPdfUrl"
            defaultValue={app.ebookPdfUrl ?? ""}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Frases de progresso (uma por linha)
          <textarea
            name="progressPhrases"
            defaultValue={phrases.join("\n")}
            rows={5}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <button
          type="submit"
          className="self-start rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Salvar
        </button>
      </form>
    </section>
  );
}
