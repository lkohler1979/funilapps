import { updateAppLabel, updateNavItem } from "../content-actions";

type NavRow = { id: string; page: string; icon: string | null; label: string; order: number };
type LabelRow = { id: string; key: string; value: string };

export function MenuSection({
  slug,
  nav,
  labels,
}: {
  slug: string;
  nav: NavRow[];
  labels: LabelRow[];
}) {
  return (
    <section id="menu" className="mt-10 rounded-lg border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
      <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">
        Menu e textos
      </h2>

      <h3 className="mb-2 text-sm font-semibold text-black dark:text-zinc-50">
        Abas do app
      </h3>
      <div className="mb-6 flex flex-col gap-2">
        {nav.map((item) => (
          <form key={item.id} action={updateNavItem} className="flex items-center gap-2">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="slug" value={slug} />
            <span className="w-24 shrink-0 text-xs text-zinc-500">{item.page}</span>
            <input
              name="label"
              defaultValue={item.label}
              required
              className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
            />
            <button
              type="submit"
              className="rounded-full border border-black/[.12] px-3 py-1 text-xs font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
            >
              Salvar
            </button>
          </form>
        ))}
      </div>

      <h3 className="mb-2 text-sm font-semibold text-black dark:text-zinc-50">
        Textos ({labels.length})
      </h3>
      <div className="flex flex-col gap-2">
        {labels.map((label) => (
          <form key={label.id} action={updateAppLabel} className="flex items-center gap-2">
            <input type="hidden" name="id" value={label.id} />
            <input type="hidden" name="slug" value={slug} />
            <span className="w-40 shrink-0 truncate text-xs text-zinc-500" title={label.key}>
              {label.key}
            </span>
            <input
              name="value"
              defaultValue={label.value}
              className="flex-1 rounded border border-black/[.12] bg-transparent px-2 py-1 text-sm text-black dark:border-white/[.15] dark:text-zinc-50"
            />
            <button
              type="submit"
              className="rounded-full border border-black/[.12] px-3 py-1 text-xs font-medium text-black hover:border-black/[.3] dark:border-white/[.15] dark:text-zinc-50 dark:hover:border-white/[.3]"
            >
              Salvar
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}
