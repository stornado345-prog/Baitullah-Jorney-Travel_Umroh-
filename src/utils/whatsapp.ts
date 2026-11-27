import { formatDateLong } from './formatters.ts';

export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/[^\d]/g, '') ||
  '6281200000000';

export interface WhatsAppMessageOptions {
  packageName?: string;
  departureDate?: string;
  visitorName?: string;
  participantCount?: number;
  customNote?: string;
}

export function buildWhatsAppUrl(options: WhatsAppMessageOptions = {}): string {
  const lines: string[] = [
    'Assalamu alaikum Tim Baitullah Journey (Portofolio Demonstrasi),',
    '',
    'Saya ingin berkonsultasi mengenai rencana perjalanan Umroh:',
  ];

  if (options.packageName) {
    lines.push(`- Paket: ${options.packageName}`);
  }
  if (options.departureDate) {
    lines.push(`- Pilihan Keberangkatan: ${formatDateLong(options.departureDate)}`);
  }
  if (options.participantCount) {
    lines.push(`- Jumlah Jamaah: ${options.participantCount} orang`);
  }
  if (options.visitorName) {
    lines.push(`- Nama: ${options.visitorName}`);
  }
  if (options.customNote) {
    lines.push(`- Catatan: ${options.customNote}`);
  }
  if (!options.packageName && !options.departureDate && !options.customNote) {
    lines.push('- Topik: Informasi jadwal keberangkatan & persiapan Umroh');
  }

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
