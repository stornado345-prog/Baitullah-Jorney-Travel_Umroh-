import { AppError } from '../../middleware/errorHandler.ts';
import { findPackageBySlug, findPackages, type PackageListFilter } from './package.repository.ts';

export async function listPackages(filter: PackageListFilter) {
  return findPackages(filter);
}

export async function getPackageDetailsBySlug(slug: string) {
  const pkg = await findPackageBySlug(slug);
  if (!pkg) {
    throw new AppError('Paket Umroh tidak ditemukan.', 404);
  }
  return pkg;
}
