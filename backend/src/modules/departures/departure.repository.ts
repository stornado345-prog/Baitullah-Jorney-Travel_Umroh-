import { getDb, type SqlParam } from '../../config/database.ts';
import type { Departure } from '../../types/domain.ts';

export async function findAllDepartures(month?: string): Promise<Departure[]> {
  const db = getDb();
  const whereClauses = ["p.status = 'active'"];
  const params: SqlParam[] = [];

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    whereClauses.push('d.departure_date LIKE ?');
    params.push(`${month}%`);
  }

  return db.query<Departure>(
    `SELECT
      d.id,
      d.package_id,
      p.name AS package_name,
      p.slug AS package_slug,
      d.departure_date,
      d.return_date,
      d.quota,
      d.status,
      d.created_at,
      d.updated_at
    FROM departures d
    INNER JOIN packages p ON p.id = d.package_id
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY d.departure_date ASC`,
    params
  );
}

export async function findDeparturesByPackageId(packageId: number): Promise<Departure[]> {
  const db = getDb();
  return db.query<Departure>(
    `SELECT
      d.id,
      d.package_id,
      d.departure_date,
      d.return_date,
      d.quota,
      d.status,
      d.created_at,
      d.updated_at
    FROM departures d
    WHERE d.package_id = ?
    ORDER BY d.departure_date ASC`,
    [packageId]
  );
}

export async function findDepartureById(id: number): Promise<Departure | null> {
  const db = getDb();
  const rows = await db.query<Departure>(
    `SELECT * FROM departures WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}
