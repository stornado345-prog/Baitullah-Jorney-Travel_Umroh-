import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from './errorHandler.ts';

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.') || 'body';
        if (!fieldErrors[key]) {
          fieldErrors[key] = [];
        }
        fieldErrors[key].push(issue.message);
      }
      next(new AppError('Mohon periksa kembali isian formulir Anda.', 400, fieldErrors));
      return;
    }
    req.body = parsed.data;
    next();
  };
}
