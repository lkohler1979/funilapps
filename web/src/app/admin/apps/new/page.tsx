import { createApp } from "../actions";

const ERROR_MESSAGES: Record<string, string> = {
  slug: "Slug inválido. Use apenas letras minúsculas, números e hífens.",
  campos: "Preencha todos os campos obrigatórios.",
  imagem: "Selecione uma imagem para o app.",
  duplicado: "Já existe um app com esse slug.",
};

export default async function NewAppPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Novo app
      </h1>

      {erro && (
        <p className="mb-4 rounded-lg border border-red-600/30 bg-red-50 p-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-950 dark:text-red-300">
          {ERROR_MESSAGES[erro] ?? "Erro ao criar app."}
        </p>
      )}

      <form
        action={createApp}
        className="flex flex-col gap-4 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950"
      >
        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Slug (URL, ex: ansiedade)
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            placeholder="meu-novo-app"
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Nome
          <input
            name="name"
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Categoria
          <input
            name="category"
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Descrição
          <textarea
            name="description"
            required
            rows={4}
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Preço (centavos)
          <input
            name="priceCents"
            type="number"
            min={0}
            defaultValue={999}
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Cor de destaque (opcional)
          <input
            name="accentColor"
            type="color"
            defaultValue="#111827"
            className="h-10 w-20 rounded border border-black/[.12] bg-transparent dark:border-white/[.15]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Status
          <select
            name="status"
            defaultValue="draft"
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
          Imagem de capa
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="rounded border border-black/[.12] bg-transparent px-3 py-2 text-black dark:border-white/[.15] dark:text-zinc-50"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Criar app
        </button>
      </form>
    </div>
  );
}
