import { addVideo, deleteVideo, updateVideo } from "../content-actions";

type VideoRow = { id: string; videoId: string; title: string; num: string | null; order: number };

export function VideosSection({
  appId,
  slug,
  videos,
}: {
  appId: string;
  slug: string;
  videos: VideoRow[];
}) {
  return (
    <section className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Aulas em vídeo ({videos.length})
      </h2>

      <div className="flex flex-col gap-2">
        {videos.map((video) => (
          <details
            key={video.id}
            className="rounded border border-black/[.08] p-3 dark:border-white/[.1]"
          >
            <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
              {video.num ? `${video.num} — ` : ""}
              {video.title}
            </summary>
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block break-all text-xs text-zinc-500 hover:underline"
            >
              https://www.youtube.com/watch?v={video.videoId}
            </a>
            <form action={updateVideo} className="mt-3 flex flex-col gap-2">
              <input type="hidden" name="id" value={video.id} />
              <input type="hidden" name="slug" value={slug} />
              <input
                name="videoId"
                defaultValue={video.videoId}
                required
                placeholder="ID do YouTube (ex: dQw4w9WgXcQ)"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="title"
                defaultValue={video.title}
                required
                placeholder="Título"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input
                name="num"
                defaultValue={video.num ?? ""}
                placeholder="ex: AULA 1"
                className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
              />
              <input type="hidden" name="order" value={video.order} />
              <button
                type="submit"
                className="self-start rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Salvar
              </button>
            </form>
            <form action={deleteVideo} className="mt-2">
              <input type="hidden" name="id" value={video.id} />
              <input type="hidden" name="slug" value={slug} />
              <button
                type="submit"
                className="text-xs text-red-600 hover:underline dark:text-red-400"
              >
                Remover vídeo
              </button>
            </form>
          </details>
        ))}
      </div>

      <details className="mt-4 rounded border border-dashed border-black/[.2] p-3 dark:border-white/[.2]">
        <summary className="cursor-pointer text-sm font-medium text-black dark:text-zinc-50">
          + Novo vídeo
        </summary>
        <form action={addVideo} className="mt-3 flex flex-col gap-2">
          <input type="hidden" name="appId" value={appId} />
          <input type="hidden" name="slug" value={slug} />
          <input
            name="videoId"
            required
            placeholder="ID do YouTube (ex: dQw4w9WgXcQ)"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="title"
            required
            placeholder="Título"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input
            name="num"
            placeholder="ex: AULA 1"
            className="rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
          />
          <input type="hidden" name="order" value={videos.length} />
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
