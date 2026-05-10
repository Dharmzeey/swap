export function formatNaira(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

export function formatNairaShort(amount: number): string {
  const n = Math.abs(amount);
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return "₦" + (Number.isInteger(v) ? v : v.toFixed(1)) + "M";
  }
  if (n >= 1_000) {
    return "₦" + Math.round(n / 1_000) + "k";
  }
  return "₦" + n;
}
