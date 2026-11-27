import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../../middleware/validateRequest.ts';
import {
  createRegistrationSchema,
  postRegistrationController,
} from './registration.controller.ts';

const router = Router();

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak pengiriman pendaftaran dari jaringan ini. Silakan tunggu beberapa menit sebelum mencoba kembali.',
  },
});

router.post(
  '/',
  registrationLimiter,
  validateBody(createRegistrationSchema),
  postRegistrationController
);

export default router;
