export function formatDate(timestampOrStr: number | string | null | undefined): string {
  if (!timestampOrStr) return 'Date unavailable';
  try {
    const d = typeof timestampOrStr === 'number' ? new Date(timestampOrStr) : new Date(timestampOrStr);
    if (isNaN(d.getTime())) return 'Date unavailable';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Date unavailable';
  }
}

export function formatTime(timestampOrStr: number | string | null | undefined): string {
  if (!timestampOrStr) return '';
  try {
    const d = typeof timestampOrStr === 'number' ? new Date(timestampOrStr) : new Date(timestampOrStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '';
  }
}

export function getTimeOfDay(timestamp: number): 'morning' | 'afternoon' | 'evening' | 'lateNight' {
  const d = new Date(timestamp);
  const h = d.getHours();
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 23) return 'evening';
  return 'lateNight';
}

export function isSameDay(timeA: number, timeB: number): boolean {
  const dA = new Date(timeA);
  const dB = new Date(timeB);
  return (
    dA.getFullYear() === dB.getFullYear() &&
    dA.getMonth() === dB.getMonth() &&
    dA.getDate() === dB.getDate()
  );
}
