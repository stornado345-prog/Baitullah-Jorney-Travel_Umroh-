import type { NextFunction, Request, Response } from 'express';
import { getPackageDetailsBySlug, listPackages } from './package.service.ts';

export async function getPackagesController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const month = typeof req.query.month === 'string' ? req.query.month : undefined;
    const duration = typeof req.query.duration === 'string' && req.query.duration ? Number(req.query.duration) : undefined;
    const sortParam = typeof req.query.sort === 'string' ? req.query.sort : undefined;
    const allowedSorts = ['price_asc', 'price_desc', 'duration_asc', 'departure_asc'] as const;
    const sort = allowedSorts.includes(sortParam as (typeof allowedSorts)[number])
      ? (sortParam as (typeof allowedSorts)[number])
      : undefined;
    const limit = typeof req.query.limit === 'string' && req.query.limit ? Number(req.query.limit) : 24;
    const page = typeof req.query.page === 'string' && req.query.page ? Math.max(Number(req.query.page), 1) : 1;
    const offset = (page - 1) * limit;

    const result = await listPackages({ search, month, duration, sort, limit, offset });

    res.json({
      success: true,
      message: 'Packages retrieved successfully',
      data: result.items,
      meta: {
        total: result.total,
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getPackageBySlugController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = String(req.params.slug || '').trim();
    const pkg = await getPackageDetailsBySlug(slug);
    res.json({
      success: true,
      message: 'Package details retrieved successfully',
      data: pkg,
    });
  } catch (err) {
    next(err);
  }
}
