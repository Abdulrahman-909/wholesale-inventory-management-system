export function formatCurrency(value) {
  const num = Number(value ?? 0)
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'AFN' }).format(num)
}
