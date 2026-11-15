import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logout } from "@/app/login/actions";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[.08] bg-white px-6 py-4 dark:border-white/[.1] dark:bg-black sm:px-12">
        <nav className="flex flex-wrap items-center gap-6 text-sm">
          <Link href="/admin" className="font-semibold text-black dark:text-zinc-50">
            Painel
          </Link>
          <Link
            href="/admin/apps"
            className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Apps
          </Link>
          <Link
            href="/admin/purchases"
            className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Vendas
          </Link>
          <Link
            href="/"
            className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Ver site
          </Link>
        </nav>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Sair
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-12">{children}</main>
    </div>
  );
}
