import { addNews, deleteNews, updateNews } from "../content-actions";

type NewsRow = {
  id: string;
  title: string;
  source: string | null;
  url: string;
  date: string | null;
  order: number;
};

export function NewsSection({
  appId,
  slug,
  news,
}: {
  appId: string;
  slug: string;
  news: NewsRow[];
}) {
  return (
    <section className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Notícias ({news.length})
      </h2>

      <div className="flex flex-col gap-2">
        {news.map((item) => (
          <details
            key={item.id}
            className="rounded border border-black/[.08] p-3 dark:border-white/[.1]"
          >
            <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
              {item.title}
            </summary>
            <form action={updateNews} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="slug" value={slug} />
              <input
                name="title"
                defaultValue={item.title}
                required
                placeholder="Título"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="url"
                defaultValue={item.url}
                required
                placeholder="URL"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="source"
                defaultValue={item.source ?? ""}
                placeholder="Fonte"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="date"
                defaultValue={item.date ?? ""}
                placeholder="Data (ex: 2026-01-10)"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input type="hidden" name="order" value={item.order} />
              <button
                type="submit"
                className="self-start rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Salvar
              </button>
            </form>
            <form action={deleteNews} className="mt-2">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="slug" value={slug} />
              <button
                type="submit"
                className="text-xs text-red-600 hover:underline dark:text-red-400"
              >
                Remover notícia
              </button>
            </form>
          </details>
        ))}
      </div>

      <details className="mt-4 rounded border border-dashed border-black/[.2] p-3 dark:border-white/[.2]">
        <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
          + Nova notícia
        </summary>
        <form action={addNews} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="appId" value={appId} />
          <input type="hidden" name="slug" value={slug} />
          <input
            name="title"
            required
            placeholder="Título"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="url"
            required
            placeholder="URL"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="source"
            placeholder="Fonte"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="date"
            placeholder="Data (ex: 2026-01-10)"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input type="hidden" name="order" value={news.length} />
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
