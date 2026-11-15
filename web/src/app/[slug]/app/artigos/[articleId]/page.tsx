import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; articleId: string }>;
}) {
  const { slug, articleId } = await params;
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/${slug}/app`}
        className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        ← Voltar
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-black dark:text-zinc-50">
        {article.icon ? `${article.icon} ` : ""}
        {article.title}
      </h1>
      {article.subtitle && (
        <p className="mt-1 text-sm text-zinc-500">{article.subtitle}</p>
      )}
      <div
        className="mt-6 text-zinc-700 dark:text-zinc-300 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-black [&_h2]:dark:text-zinc-50 [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}
