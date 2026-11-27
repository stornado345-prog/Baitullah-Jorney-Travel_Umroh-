import { AppError } from '../../middleware/errorHandler.ts';
import type { CreateRegistrationInput } from '../../types/domain.ts';
import { findDepartureById } from '../departures/departure.repository.ts';
import { findPackageById } from '../packages/package.repository.ts';
import {
  findDuplicateRegistration,
  insertRegistrationWithQuotaCheck,
} from './registration.repository.ts';

function normalizeIndonesianPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('08')) {
    return `+62${digits.slice(1)}`;
  }
  if (digits.startsWith('62')) {
    return `+${digits}`;
  }
  return digits;
}

export async function createRegistration(input: CreateRegistrationInput) {
  const pkg = await findPackageById(input.packageId);
  if (!pkg) {
    throw new AppError('Paket Umroh yang dipilih tidak ditemukan.', 404);
  }

  const departure = await findDepartureById(input.departureId);
  if (!departure || Number(departure.package_id) !== pkg.id) {
    throw new AppError('Jadwal keberangkatan tidak sesuai dengan paket yang dipilih.', 400);
  }

  if (departure.status === 'closed' || departure.status === 'full' || Number(departure.quota) <= 0) {
    throw new AppError('Jadwal keberangkatan yang dipilih sudah penuh atau ditutup.', 409);
  }

  if (Number(departure.quota) < input.participantCount) {
    throw new AppError(
      `Tersisa ${departure.quota} kuota contoh untuk tanggal keberangkatan ini.`,
      409
    );
  }

  const normalizedPhone = normalizeIndonesianPhone(input.phone);
  const duplicate = await findDuplicateRegistration(normalizedPhone, departure.id);
  if (duplicate) {
    throw new AppError(
      'Pendaftaran aktif dengan nomor WhatsApp ini sudah tercatat untuk jadwal keberangkatan tersebut.',
      409
    );
  }

  try {
    const registrationId = await insertRegistrationWithQuotaCheck({
      ...input,
      phone: normalizedPhone,
    });

    return {
      registrationId,
      packageName: pkg.name,
      departureDate: departure.departure_date,
      participantCount: input.participantCount,
    };
  } catch (err) {
    if (err instanceof Error && err.message === 'INSUFFICIENT_QUOTA') {
      throw new AppError('Kuota keberangkatan yang dipilih tidak mencukupi.', 409);
    }
    if (err instanceof Error && err.message === 'DEPARTURE_MISMATCH') {
      throw new AppError('Jadwal keberangkatan tidak valid untuk paket ini.', 400);
    }
    throw err;
  }
}
