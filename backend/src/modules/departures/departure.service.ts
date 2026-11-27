import { AppError } from '../../middleware/errorHandler.ts';
import { findPackageById } from '../packages/package.repository.ts';
import { findAllDepartures, findDeparturesByPackageId } from './departure.repository.ts';

export async function listDepartures(month?: string) {
  return findAllDepartures(month);
}

export async function listPackageDepartures(packageId: number) {
  if (!Number.isInteger(packageId) || packageId <= 0) {
    throw new AppError('ID paket tidak valid.', 400);
  }
  const pkg = await findPackageById(packageId);
  if (!pkg) {
    throw new AppError('Paket Umroh tidak ditemukan.', 404);
  }
  return findDeparturesByPackageId(packageId);
}
