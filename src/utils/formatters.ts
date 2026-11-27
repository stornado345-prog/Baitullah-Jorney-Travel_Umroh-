export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateLong(isoDate: string): string {
  if (!isoDate) return '—';
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function formatMonthLabel(yearMonth: string): string {
  if (!yearMonth) return '';
  const parsed = new Date(`${yearMonth}-01T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return yearMonth;
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export function formatDepartureStatusLabel(status: string, quota: number): string {
  if (status === 'full' || quota <= 0) return 'Kuota Penuh';
  if (status === 'closed') return 'Ditutup';
  if (status === 'limited' || quota <= 10) return `Terbatas · ${quota} Kursi Contoh`;
  return `Tersedia · ${quota} Kursi Contoh`;
}
