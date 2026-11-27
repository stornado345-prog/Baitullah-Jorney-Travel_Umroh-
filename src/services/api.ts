import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '';

export const apiClient = axios.create({
  baseURL: baseURL ? `${baseURL.replace(/\/$/, '')}/api` : '/api',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function extractApiErrorMessage(
  err: unknown,
  fallback = 'Terjadi kesalahan. Silakan coba kembali.'
): string {
  if (axios.isAxiosError(err)) {
    const serverMsg = (err.response?.data as { message?: string } | undefined)?.message;
    if (serverMsg) return serverMsg;
    if (err.code === 'ECONNABORTED') {
      return 'Koneksi melebihi batas waktu. Periksa jaringan Anda lalu coba kembali.';
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
