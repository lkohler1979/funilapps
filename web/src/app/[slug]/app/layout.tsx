import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isUnlocked } from "@/lib/access";

const NAV_ICONS: Record<string, string> = {
  home: "🏠",
  reels: "🎬",
  podcast: "🎧",
  ebook: "📖",
  treinos: "🏆",
  progress: "🔥",
  quiz: "🧠",
};

export default async function MiniAppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await prisma.app.findUnique({ where: { slug } });

  if (!app) {
    notFound();
  }

  const unlocked = await isUnlocked(app.id);
  if (!unlocked) {
    redirect(`/${slug}`);
  }

  const nav = Array.isArray(app.navigation)
    ? (app.navigation as { page: string; label: string }[])
    : [];

  return (
    <div
      className="min-h-screen bg-zinc-50 pb-20 dark:bg-black"
      style={
        app.accentColor
          ? ({ "--app-accent": app.accentColor } as React.CSSProperties)
          : undefined
      }
    >
      <header className="flex items-center justify-between border-b border-black/[.08] bg-white px-6 py-4 dark:border-white/[.1] dark:bg-black sm:px-12">
        <Link
          href={`/${slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← Sair do app
        </Link>
        <span className="text-sm font-medium text-black dark:text-zinc-50">
          {app.name}
        </span>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-6 sm:px-12">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 flex justify-center border-t border-black/[.08] bg-white dark:border-white/[.1] dark:bg-black">
        <div className="flex w-full max-w-2xl overflow-x-auto">
          {nav.map((item) => (
            <Link
              key={item.page}
              href={
                item.page === "home" ? `/${slug}/app` : `/${slug}/app/${item.page}`
              }
              className="flex flex-1 flex-col items-center gap-1 px-2 py-3 text-xs text-zinc-500 hover:text-black dark:hover:text-zinc-50"
            >
              <span className="text-lg leading-none">
                {NAV_ICONS[item.page] ?? "•"}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
