export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() ||
  'halo@baitullah-journey-demo.example';

export const OFFICE_ADDRESS =
  (import.meta.env.VITE_OFFICE_ADDRESS as string | undefined)?.trim() ||
  'Jl. Contoh Kebayoran Baru No. 18, Jakarta Selatan 12160, Indonesia (Alamat Simulasi)';
