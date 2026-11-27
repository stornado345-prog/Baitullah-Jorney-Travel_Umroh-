import { Router, type Request, type Response } from 'express';
import { getDb } from '../config/database.ts';
import packageRoutes from '../modules/packages/package.routes.ts';
import departureRoutes from '../modules/departures/departure.routes.ts';
import registrationRoutes from '../modules/registrations/registration.routes.ts';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    await db.query('SELECT 1 AS ok');
    res.json({
      success: true,
      message: 'Baitullah Journey API is healthy',
      data: {
        status: 'ok',
        database: db.engine,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'Database connectivity check failed',
    });
  }
});

router.use('/packages', packageRoutes);
router.use('/departures', departureRoutes);
router.use('/registrations', registrationRoutes);

export default router;
