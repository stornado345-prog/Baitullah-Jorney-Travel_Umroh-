import { getDb } from '../../config/database.ts';
import type { CreateRegistrationInput } from '../../types/domain.ts';

export async function findDuplicateRegistration(phone: string, departureId: number): Promise<boolean> {
  const db = getDb();
  const rows = await db.query<{ id: number }>(
    `SELECT id
    FROM registrations
    WHERE phone = ? AND departure_id = ? AND status IN ('pending', 'contacted', 'confirmed')
    LIMIT 1`,
    [phone, departureId]
  );
  return rows.length > 0;
}

export async function insertRegistrationWithQuotaCheck(input: CreateRegistrationInput): Promise<number> {
  const db = getDb();

  return db.transaction(async (tx) => {
    const depRows = await tx.query<{ id: number; package_id: number; quota: number; status: string }>(
      `SELECT id, package_id, quota, status FROM departures WHERE id = ? LIMIT 1`,
      [input.departureId]
    );
    const departure = depRows[0];
    if (!departure || Number(departure.package_id) !== input.packageId) {
      throw new Error('DEPARTURE_MISMATCH');
    }
    if (departure.status === 'full' || departure.status === 'closed' || Number(departure.quota) < input.participantCount) {
      throw new Error('INSUFFICIENT_QUOTA');
    }

    const result = await tx.execute(
      `INSERT INTO registrations (
        package_id,
        departure_id,
        full_name,
        phone,
        email,
        participant_count,
        message,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        input.packageId,
        input.departureId,
        input.fullName,
        input.phone,
        input.email || null,
        input.participantCount,
        input.message || null,
      ]
    );

    const remainingQuota = Number(departure.quota) - input.participantCount;
    const nextStatus = remainingQuota <= 0 ? 'full' : remainingQuota <= 10 ? 'limited' : departure.status;

    await tx.execute(
      `UPDATE departures SET quota = ?, status = ? WHERE id = ?`,
      [Math.max(remainingQuota, 0), nextStatus, input.departureId]
    );

    return result.insertId;
  });
}
