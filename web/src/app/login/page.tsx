import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <form
        action={login}
        className="w-full max-w-sm rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950"
      >
        <h1 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
          Login do administrador
        </h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">
            E-mail ou senha incorretos.
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          E-mail
          <input
            type="email"
            name="email"
            required
            autoFocus
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="mt-4 flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Senha
          <input
            type="password"
            name="password"
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
