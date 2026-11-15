export const BUNDLE_PRICE_CENTS = 9700; // R$ 97,00 — todos os 36 apps

export function formatCents(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
