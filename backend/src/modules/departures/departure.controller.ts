import type { NextFunction, Request, Response } from 'express';
import { listDepartures, listPackageDepartures } from './departure.service.ts';

export async function getDeparturesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const month = typeof req.query.month === 'string' ? req.query.month : undefined;
    const departures = await listDepartures(month);
    res.json({
      success: true,
      message: 'Departures retrieved successfully',
      data: departures,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPackageDeparturesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const packageId = Number(req.params.packageId);
    const departures = await listPackageDepartures(packageId);
    res.json({
      success: true,
      message: 'Package departures retrieved successfully',
      data: departures,
    });
  } catch (err) {
    next(err);
  }
}
