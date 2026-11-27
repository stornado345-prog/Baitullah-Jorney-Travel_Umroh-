import type { ApiResponse, Departure, UmrahPackage } from '../types/travel.ts';
import { apiClient } from './api.ts';

export interface PackageQueryParams {
  search?: string;
  month?: string;
  duration?: number;
  sort?: 'price_asc' | 'price_desc' | 'duration_asc' | 'departure_asc';
  limit?: number;
  page?: number;
}

export async function fetchPackages(params: PackageQueryParams = {}): Promise<{
  items: UmrahPackage[];
  total: number;
}> {
  const response = await apiClient.get<ApiResponse<UmrahPackage[]>>('/packages', { params });
  return {
    items: response.data.data,
    total: response.data.meta?.total ?? response.data.data.length,
  };
}

export async function fetchPackageBySlug(slug: string): Promise<UmrahPackage> {
  const response = await apiClient.get<ApiResponse<UmrahPackage>>(`/packages/${encodeURIComponent(slug)}`);
  return response.data.data;
}

export async function fetchPackageDepartures(packageId: number): Promise<Departure[]> {
  const response = await apiClient.get<ApiResponse<Departure[]>>(`/packages/${packageId}/departures`);
  return response.data.data;
}

export async function fetchAllDepartures(month?: string): Promise<Departure[]> {
  const response = await apiClient.get<ApiResponse<Departure[]>>('/departures', {
    params: month ? { month } : undefined,
  });
  return response.data.data;
}
