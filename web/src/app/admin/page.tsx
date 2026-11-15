import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalApps, publishedApps, purchases] = await Promise.all([
    prisma.app.count(),
    prisma.app.count({ where: { status: "published" } }),
    prisma.purchase.findMany({
      where: { status: "paid" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenueCents = purchases.reduce((sum, p) => sum + p.amountCents, 0);
  const recent = purchases.slice(0, 10);
  const buyerEmails = new Set(purchases.map((p) => p.email));

  const appNames = new Map(
    (
      await prisma.app.findMany({
        where: { id: { in: Array.from(new Set(purchases.flatMap((p) => p.appIds))) } },
        select: { id: true, name: true },
      })
    ).map((a) => [a.id, a.name]),
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
        Painel
      </h1>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Apps" value={String(totalApps)} />
        <StatCard label="Publicados" value={String(publishedApps)} />
        <StatCard label="Vendas" value={String(purchases.length)} />
        <StatCard label="Receita" value={formatCents(totalRevenueCents)} />
      </div>

      <StatCard label="Compradores únicos" value={String(buyerEmails.size)} wide />

      <h2 className="mb-4 mt-10 text-lg font-semibold text-black dark:text-zinc-50">
        Vendas recentes
      </h2>
      <div className="overflow-hidden rounded-lg border border-black/[.08] dark:border-white/[.1]">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-left dark:bg-zinc-900">
            <tr>
              <th className="p-3 font-medium">E-mail</th>
              <th className="p-3 font-medium">Item</th>
              <th className="p-3 font-medium">Valor</th>
              <th className="p-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p.id} className="border-t border-black/[.08] dark:border-white/[.1]">
                <td className="p-3">{p.email}</td>
                <td className="p-3">
                  {p.type === "combo" ? "Combo: " : ""}
                  {p.appIds.map((id) => appNames.get(id) ?? id).join(" + ")}
                </td>
                <td className="p-3">{formatCents(p.amountCents)}</td>
                <td className="p-3">
                  {new Date(p.createdAt).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td className="p-3 text-zinc-500" colSpan={4}>
                  Nenhuma venda ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-black/[.08] bg-white p-4 dark:border-white/[.1] dark:bg-zinc-950 ${
        wide ? "sm:max-w-xs" : ""
      }`}
    >
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-xl font-semibold text-black dark:text-zinc-50">{value}</p>
    </div>
  );
}
