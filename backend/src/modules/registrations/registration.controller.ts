import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { createRegistration } from './registration.service.ts';

export const createRegistrationSchema = z.object({
  packageId: z.coerce.number().int().positive('Silakan pilih paket Umroh yang tersedia.'),
  departureId: z.coerce.number().int().positive('Silakan pilih jadwal keberangkatan.'),
  fullName: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal terdiri dari 3 karakter.')
    .max(150, 'Nama lengkap maksimal 150 karakter.'),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,11}$/,
      'Masukkan nomor WhatsApp Indonesia yang valid (contoh: 081234567890 atau +6281234567890).'
    ),
  email: z
    .string()
    .trim()
    .email('Masukkan alamat email yang valid.')
    .max(160, 'Alamat email maksimal 160 karakter.')
    .optional()
    .or(z.literal('')),
  participantCount: z.coerce
    .number()
    .int()
    .min(1, 'Minimal 1 orang peserta.')
    .max(20, 'Maksimal 20 orang peserta per pendaftaran.'),
  message: z
    .string()
    .trim()
    .max(1000, 'Catatan tambahan maksimal 1000 karakter.')
    .optional()
    .or(z.literal('')),
});

export async function postRegistrationController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as z.infer<typeof createRegistrationSchema>;
    const result = await createRegistration({
      packageId: body.packageId,
      departureId: body.departureId,
      fullName: body.fullName,
      phone: body.phone,
      email: body.email || undefined,
      participantCount: body.participantCount,
      message: body.message || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Pendaftaran minat Umroh berhasil dikirim',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
