import { addPodcast, deletePodcast, updatePodcast } from "../content-actions";

type PodcastRow = {
  id: string;
  title: string;
  duration: string | null;
  url: string;
  free: boolean;
  order: number;
};

export function PodcastsSection({
  appId,
  slug,
  podcasts,
}: {
  appId: string;
  slug: string;
  podcasts: PodcastRow[];
}) {
  return (
    <section className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Áudios ({podcasts.length})
      </h2>

      <div className="flex flex-col gap-2">
        {podcasts.map((podcast) => (
          <details
            key={podcast.id}
            className="rounded border border-black/[.08] p-3 dark:border-white/[.1]"
          >
            <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
              {podcast.title}
            </summary>
            <form action={updatePodcast} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={podcast.id} />
              <input type="hidden" name="slug" value={slug} />
              <input
                name="title"
                defaultValue={podcast.title}
                required
                placeholder="Título"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="url"
                defaultValue={podcast.url}
                required
                placeholder="URL do áudio (.mp3)"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="duration"
                defaultValue={podcast.duration ?? ""}
                placeholder="ex: 28 min"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input type="checkbox" name="free" defaultChecked={podcast.free} />
                Gratuito
              </label>
              <input type="hidden" name="order" value={podcast.order} />
              <button
                type="submit"
                className="self-start rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Salvar
              </button>
            </form>
            <form action={deletePodcast} className="mt-2">
              <input type="hidden" name="id" value={podcast.id} />
              <input type="hidden" name="slug" value={slug} />
              <button
                type="submit"
                className="text-xs text-red-600 hover:underline dark:text-red-400"
              >
                Remover áudio
              </button>
            </form>
          </details>
        ))}
      </div>

      <details className="mt-4 rounded border border-dashed border-black/[.2] p-3 dark:border-white/[.2]">
        <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
          + Novo áudio
        </summary>
        <form action={addPodcast} className="mt-3 flex flex-col gap-2">
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
            placeholder="URL do áudio (.mp3)"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="duration"
            placeholder="ex: 28 min"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input type="checkbox" name="free" defaultChecked />
            Gratuito
          </label>
          <input type="hidden" name="order" value={podcasts.length} />
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
