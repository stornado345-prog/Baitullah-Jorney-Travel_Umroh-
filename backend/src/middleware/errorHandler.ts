import type { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  statusCode: number;
  details?: Record<string, string[]>;

  constructor(message: string, statusCode = 500, details?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
    return;
  }

  console.error('Unhandled API error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.',
  });
}
