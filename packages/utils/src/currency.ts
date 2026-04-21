export function formatCurrency(
  amount: number,
  locale: string = "id-ID",
  currency: string = "IDR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}
