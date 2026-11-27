import { getDb, type SqlParam } from '../../config/database.ts';
import type { ItineraryDay, UmrahPackage } from '../../types/domain.ts';

interface RawPackageRow {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  duration_days: number;
  duration_nights: number;
  thumbnail: string;
  gallery: string | string[] | null;
  airline: string;
  makkah_hotel: string;
  madinah_hotel: string;
  included_facilities: string | string[];
  excluded_facilities: string | string[];
  itinerary: string | ItineraryDay[];
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  next_departure_date?: string | null;
  available_departures_count?: number;
}

function parseJsonField<T>(val: string | T | null | undefined, fallback: T): T {
  if (val === null || val === undefined) {
    return fallback;
  }
  if (typeof val !== 'string') {
    return val;
  }
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function mapPackageRow(row: RawPackageRow): UmrahPackage {
  return {
    id: Number(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: Number(row.price),
    duration_days: Number(row.duration_days),
    duration_nights: Number(row.duration_nights),
    thumbnail: row.thumbnail,
    gallery: parseJsonField<string[]>(row.gallery, [row.thumbnail]),
    airline: row.airline,
    makkah_hotel: row.makkah_hotel,
    madinah_hotel: row.madinah_hotel,
    included_facilities: parseJsonField<string[]>(row.included_facilities, []),
    excluded_facilities: parseJsonField<string[]>(row.excluded_facilities, []),
    itinerary: parseJsonField<ItineraryDay[]>(row.itinerary, []),
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    next_departure_date: row.next_departure_date ?? null,
    available_departures_count:
      row.available_departures_count !== undefined ? Number(row.available_departures_count) : undefined,
  };
}

export interface PackageListFilter {
  search?: string;
  month?: string;
  duration?: number;
  sort?: 'price_asc' | 'price_desc' | 'duration_asc' | 'departure_asc';
  limit?: number;
  offset?: number;
}

export async function findPackages(filter: PackageListFilter): Promise<{ items: UmrahPackage[]; total: number }> {
  const db = getDb();
  const whereClauses: string[] = ["p.status = 'active'"];
  const params: SqlParam[] = [];

  if (filter.search) {
    const pattern = `%${filter.search.trim().toLowerCase()}%`;
    whereClauses.push(
      '(LOWER(p.name) LIKE ? OR LOWER(p.makkah_hotel) LIKE ? OR LOWER(p.madinah_hotel) LIKE ? OR LOWER(p.airline) LIKE ?)'
    );
    params.push(pattern, pattern, pattern, pattern);
  }

  if (filter.duration && Number.isFinite(filter.duration)) {
    whereClauses.push('p.duration_days = ?');
    params.push(filter.duration);
  }

  if (filter.month && /^\d{4}-\d{2}$/.test(filter.month)) {
    whereClauses.push(
      "EXISTS (SELECT 1 FROM departures d2 WHERE d2.package_id = p.id AND d2.status IN ('open', 'limited') AND d2.departure_date LIKE ?)"
    );
    params.push(`${filter.month}%`);
  }

  const whereSql = whereClauses.join(' AND ');

  let orderSql = 'p.id ASC';
  if (filter.sort === 'price_asc') orderSql = 'p.price ASC';
  else if (filter.sort === 'price_desc') orderSql = 'p.price DESC';
  else if (filter.sort === 'duration_asc') orderSql = 'p.duration_days ASC';
  else if (filter.sort === 'departure_asc') orderSql = 'next_departure_date ASC';

  const limit = Math.min(Math.max(filter.limit ?? 24, 1), 50);
  const offset = Math.max(filter.offset ?? 0, 0);

  const countRows = await db.query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM packages p WHERE ${whereSql}`,
    params
  );
  const total = Number(countRows[0]?.total ?? 0);

  const rows = await db.query<RawPackageRow>(
    `SELECT
      p.*,
      (
        SELECT MIN(d.departure_date)
        FROM departures d
        WHERE d.package_id = p.id AND d.status IN ('open', 'limited') AND d.quota > 0
      ) AS next_departure_date,
      (
        SELECT COUNT(*)
        FROM departures d
        WHERE d.package_id = p.id AND d.status IN ('open', 'limited') AND d.quota > 0
      ) AS available_departures_count
    FROM packages p
    WHERE ${whereSql}
    ORDER BY ${orderSql}
    LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    items: rows.map(mapPackageRow),
    total,
  };
}

export async function findPackageBySlug(slug: string): Promise<UmrahPackage | null> {
  const db = getDb();
  const rows = await db.query<RawPackageRow>(
    `SELECT
      p.*,
      (
        SELECT MIN(d.departure_date)
        FROM departures d
        WHERE d.package_id = p.id AND d.status IN ('open', 'limited') AND d.quota > 0
      ) AS next_departure_date,
      (
        SELECT COUNT(*)
        FROM departures d
        WHERE d.package_id = p.id AND d.status IN ('open', 'limited') AND d.quota > 0
      ) AS available_departures_count
    FROM packages p
    WHERE p.slug = ? AND p.status = 'active'
    LIMIT 1`,
    [slug]
  );

  if (rows.length === 0) {
    return null;
  }
  return mapPackageRow(rows[0]);
}

export async function findPackageById(id: number): Promise<UmrahPackage | null> {
  const db = getDb();
  const rows = await db.query<RawPackageRow>(
    `SELECT p.* FROM packages p WHERE p.id = ? AND p.status = 'active' LIMIT 1`,
    [id]
  );
  if (rows.length === 0) {
    return null;
  }
  return mapPackageRow(rows[0]);
}
