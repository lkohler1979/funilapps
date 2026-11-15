import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AppHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({
    where: { slug },
    include: {
      articles: { orderBy: { order: "asc" } },
      videoLessons: { orderBy: { order: "asc" } },
    },
  });

  if (!app) {
    notFound();
  }

  const news = Array.isArray(app.news)
    ? (app.news as { title: string; source: string; url: string; date?: string }[])
    : [];

  return (
    <div>
      <section
        className="mb-8 rounded-xl p-6 text-white"
        style={{
          background: app.accentColor
            ? `linear-gradient(135deg, ${app.accentColor}, #111827)`
            : "linear-gradient(135deg, #111827, #374151)",
        }}
      >
        {app.heroBadge && (
          <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            {app.heroBadge}
          </span>
        )}
        <h1
          className="text-2xl font-bold leading-tight [&_span]:underline [&_span]:decoration-white/60"
          dangerouslySetInnerHTML={{ __html: app.heroTitle ?? app.name }}
        />
        {app.tagline && <p className="mt-2 text-sm text-white/80">{app.tagline}</p>}
      </section>

      {app.videoLessons.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
            Aulas em vídeo
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {app.videoLessons.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-40 shrink-0 rounded-lg border border-black/[.08] bg-white p-3 transition-colors hover:border-black/[.2] dark:border-white/[.1] dark:bg-zinc-950 dark:hover:border-white/[.3]"
              >
                <div className="relative mb-2 aspect-video w-full overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {video.num && (
                  <p className="text-[10px] font-semibold uppercase text-zinc-400">
                    {video.num}
                  </p>
                )}
                <p className="line-clamp-2 text-xs font-medium text-black dark:text-zinc-50">
                  {video.title}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {app.articles.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
            Artigos
          </h2>
          <div className="flex flex-col gap-3">
            {app.articles.map((article) => (
              <Link
                key={article.id}
                href={`/${slug}/app/artigos/${article.id}`}
                className="rounded-lg border border-black/[.08] bg-white p-4 transition-colors hover:border-black/[.2] dark:border-white/[.1] dark:bg-zinc-950 dark:hover:border-white/[.3]"
              >
                <p className="font-medium text-black dark:text-zinc-50">
                  {article.icon ? `${article.icon} ` : ""}
                  {article.title}
                </p>
                {article.cardDesc && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {article.cardDesc}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
            Notícias
          </h2>
          <div className="flex flex-col gap-3">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-black/[.08] bg-white p-4 transition-colors hover:border-black/[.2] dark:border-white/[.1] dark:bg-zinc-950 dark:hover:border-white/[.3]"
              >
                <p className="font-medium text-black dark:text-zinc-50">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{item.source}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
