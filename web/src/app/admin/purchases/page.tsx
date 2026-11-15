import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function AdminPurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    where: { status: "paid" },
    orderBy: { createdAt: "desc" },
  });

  const allAppIds = Array.from(new Set(purchases.flatMap((p) => p.appIds)));
  const apps = await prisma.app.findMany({
    where: { id: { in: allAppIds } },
    select: { id: true, name: true },
  });
  const appNames = new Map(apps.map((a) => [a.id, a.name]));

  const totalRevenueCents = purchases.reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-black dark:text-zinc-50">
        Vendas
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        {purchases.length} vendas · {formatCents(totalRevenueCents)} em receita
      </p>

      <div className="overflow-hidden rounded-lg border border-black/[.08] dark:border-white/[.1]">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 text-left dark:bg-zinc-900">
            <tr>
              <th className="p-3 font-medium">E-mail</th>
              <th className="p-3 font-medium">Tipo</th>
              <th className="p-3 font-medium">Item</th>
              <th className="p-3 font-medium">Valor</th>
              <th className="p-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-t border-black/[.08] dark:border-white/[.1]">
                <td className="p-3">{p.email}</td>
                <td className="p-3">{p.type === "combo" ? "Combo" : "App"}</td>
                <td className="p-3">
                  {p.appIds.map((id) => appNames.get(id) ?? id).join(" + ")}
                </td>
                <td className="p-3">{formatCents(p.amountCents)}</td>
                <td className="p-3">
                  {new Date(p.createdAt).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
            {purchases.length === 0 && (
              <tr>
                <td className="p-3 text-zinc-500" colSpan={5}>
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
