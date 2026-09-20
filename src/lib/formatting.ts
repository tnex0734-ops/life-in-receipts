export function formatDuration(ms: number | undefined | null): string {
  if (!ms || isNaN(ms) || ms <= 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export function formatAmount(amount: number | undefined | null, currency = 'INR'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '';
  const symbol = currency.toUpperCase() === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}

export function sanitizeText(val: unknown, fallback = 'Unknown'): string {
  if (val === null || val === undefined) return fallback;
  const str = String(val).trim();
  return str.length > 0 ? str : fallback;
}
