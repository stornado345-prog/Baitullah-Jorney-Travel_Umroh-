import type { ApiResponse, RegistrationPayload, RegistrationResponseData } from '../types/travel.ts';
import { apiClient } from './api.ts';

export async function submitRegistration(
  payload: RegistrationPayload
): Promise<ApiResponse<RegistrationResponseData>> {
  const response = await apiClient.post<ApiResponse<RegistrationResponseData>>('/registrations', payload);
  return response.data;
}
