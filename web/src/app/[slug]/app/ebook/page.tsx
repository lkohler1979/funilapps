import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EbookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  const features = await prisma.ebookFeature.findMany({
    where: { appId: app.id },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-black dark:text-zinc-50">
        📖 {app.ebookTitle ?? "E-Book"}
      </h1>
      {app.ebookSubtitle && (
        <p className="mb-6 text-sm text-zinc-500">{app.ebookSubtitle}</p>
      )}

      {features.length > 0 && (
        <ul className="mb-6 flex flex-col gap-2">
          {features.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <span>{f.icon ?? "✓"}</span>
              {f.text}
            </li>
          ))}
        </ul>
      )}

      {app.ebookPdfUrl && (
        <a
          href={app.ebookPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-foreground px-5 py-2 text-center text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Ler E-Book
        </a>
      )}
    </div>
  );
}
