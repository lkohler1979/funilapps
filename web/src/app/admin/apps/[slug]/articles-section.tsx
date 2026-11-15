import { addArticle, deleteArticle, updateArticle } from "../content-actions";

type ArticleRow = {
  id: string;
  icon: string | null;
  title: string;
  cardDesc: string | null;
  subtitle: string | null;
  content: string;
  order: number;
};

export function ArticlesSection({
  appId,
  slug,
  articles,
}: {
  appId: string;
  slug: string;
  articles: ArticleRow[];
}) {
  return (
    <section className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Artigos ({articles.length})
      </h2>

      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <details
            key={article.id}
            className="rounded border border-black/[.08] p-3 dark:border-white/[.1]"
          >
            <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
              {article.icon} {article.title}
            </summary>
            <form action={updateArticle} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={article.id} />
              <input type="hidden" name="slug" value={slug} />
              <div className="flex gap-2">
                <input
                  name="icon"
                  defaultValue={article.icon ?? ""}
                  placeholder="ícone"
                  className="w-16 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
                />
                <input
                  name="title"
                  defaultValue={article.title}
                  required
                  placeholder="Título"
                  className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
                />
              </div>
              <input
                name="cardDesc"
                defaultValue={article.cardDesc ?? ""}
                placeholder="Descrição curta (card)"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="subtitle"
                defaultValue={article.subtitle ?? ""}
                placeholder="Subtítulo"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <textarea
                name="content"
                defaultValue={article.content}
                rows={6}
                placeholder="Conteúdo (HTML)"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 font-mono text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input type="hidden" name="order" value={article.order} />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
                >
                  Salvar
                </button>
              </div>
            </form>
            <form action={deleteArticle} className="mt-2">
              <input type="hidden" name="id" value={article.id} />
              <input type="hidden" name="slug" value={slug} />
              <button
                type="submit"
                className="text-xs text-red-600 hover:underline dark:text-red-400"
              >
                Remover artigo
              </button>
            </form>
          </details>
        ))}
      </div>

      <details className="mt-4 rounded border border-dashed border-black/[.2] p-3 dark:border-white/[.2]">
        <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
          + Novo artigo
        </summary>
        <form action={addArticle} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="appId" value={appId} />
          <input type="hidden" name="slug" value={slug} />
          <div className="flex gap-2">
            <input
              name="icon"
              placeholder="ícone"
              className="w-16 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
            />
            <input
              name="title"
              required
              placeholder="Título"
              className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
            />
          </div>
          <input
            name="cardDesc"
            placeholder="Descrição curta (card)"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="subtitle"
            placeholder="Subtítulo"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <textarea
            name="content"
            rows={6}
            placeholder="Conteúdo (HTML)"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 font-mono text-xs text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input type="hidden" name="order" value={articles.length} />
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
