import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import mysql from 'mysql2/promise';

export type SqlParam = string | number | null;

export interface ExecuteResult {
  insertId: number;
  affectedRows: number;
}

interface DbAdapter {
  engine: 'mysql' | 'sqlite';
  query: <T = Record<string, unknown>>(sql: string, params?: SqlParam[]) => Promise<T[]>;
  execute: (sql: string, params?: SqlParam[]) => Promise<ExecuteResult>;
  transaction: <T>(fn: (tx: Pick<DbAdapter, 'query' | 'execute'>) => Promise<T>) => Promise<T>;
}

let adapter: DbAdapter | null = null;

const SEED_PACKAGES = [
  {
    name: 'Umrah Safah Signature 9 Hari',
    slug: 'safah-signature-9d8n-umrah',
    description:
      'Program contoh sembilan hari yang memadukan penerbangan langsung Jakarta–Jeddah dengan hotel bintang lima di pelataran Masjidil Haram dan Masjid Nabawi.',
    price: 34500000,
    duration_days: 9,
    duration_nights: 8,
    thumbnail: '/src/assets/images/package_makkah_haram_1795245601010.jpg',
    gallery: [
      '/src/assets/images/package_makkah_haram_1795245601010.jpg',
      '/src/assets/images/package_luxury_suite_1795245600782.jpg',
      '/src/assets/images/package_madinah_courtyard_1795245601259.jpg',
    ],
    airline: 'Saudia Airlines (Langsung CGK – JED)',
    makkah_hotel: 'Pullman Zamzam Makkah (Contoh Bintang 5 · ~150m ke Haram)',
    madinah_hotel: 'Anwar Al Madinah Movenpick (Contoh Bintang 5 · ~120m ke Nabawi)',
    included_facilities: [
      'Tiket pesawat pulang-pergi kelas ekonomi (rute demonstrasi)',
      'Akomodasi hotel 4 malam di Madinah & 4 malam di Makkah',
      'Konsumsi 3 kali sehari menu Nusantara & internasional',
      'Pengurusan visa Umroh & asuransi perjalanan (contoh fasilitas)',
      'Pembimbing ibadah (Mutawif) & koordinator grup berbahasa Indonesia',
      'Transportasi bus ber-AC & segmen Kereta Cepat Haramain',
      'Sesi bimbingan Manasik pra-keberangkatan & air Zamzam 5 liter',
    ],
    excluded_facilities: [
      'Biaya pembuatan atau perpanjangan paspor',
      'Tiket penerbangan domestik dari luar Jakarta',
      'Laundry pribadi, layanan kamar, dan kebutuhan telepon',
      'Ziarah tambahan di luar jadwal utama program',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Keberangkatan Jakarta & Tiba di Madinah',
        summary: 'Berkumpul di Terminal 3 Bandara Soekarno-Hatta untuk pengarahan grup, penerbangan langsung, dan check-in hotel di Madinah.',
      },
      {
        day: 2,
        title: 'Ibadah di Masjid Nabawi & Orientasi Raudhah',
        summary: 'Shalat berjamaah di Masjid Nabawi dilanjutkan orientasi jadwal kunjungan Raudhah serta pengenalan area pelataran.',
      },
      {
        day: 3,
        title: 'Ziarah Sejarah Kota Madinah',
        summary: 'Kunjungan pagi terpandu menuju Masjid Quba, Jabal Uhud, dan Masjid Qiblatain, kembali sebelum waktu Dzuhur.',
      },
      {
        day: 4,
        title: 'Refleksi Ibadah & Persiapan Miqat',
        summary: 'Waktu ibadah mandiri di Madinah dan pembekalan teknis tata cara Ihram bersama Mutawif pada malam hari.',
      },
      {
        day: 5,
        title: 'Miqat Bir Ali & Umrah Pertama di Makkah',
        summary: 'Bertolak menuju Makkah via kereta cepat atau bus setelah Dzuhur, berniat Ihram di Bir Ali, dan melaksanakan Tawaf serta Sai Umrah.',
      },
      {
        day: 6,
        title: 'Fokus Ibadah di Masjidil Haram',
        summary: 'Hari ibadah mandiri di Masjidil Haram dengan pilihan kajian sore yang tenang bersama pembimbing.',
      },
      {
        day: 7,
        title: 'Ziarah Kota Makkah & Umrah Kedua',
        summary: "Mengunjungi Jabal Rahmah, Arafah, Muzdalifah, dan Mina; tersedia opsi Miqat di Ji'ranah untuk Umrah kedua.",
      },
      {
        day: 8,
        title: 'Tawaf Wada & Transfer ke Bandara Jeddah',
        summary: 'Pelaksanaan Tawaf Wada perpisahan pada pagi hari dan pengantaran menuju Bandara Internasional King Abdulaziz Jeddah.',
      },
      {
        day: 9,
        title: 'Tiba Kembali di Jakarta',
        summary: 'Mendarat di Bandara Soekarno-Hatta Jakarta dan selesainya rangkaian perjalanan contoh.',
      },
    ],
    departures: [
      { departure_date: '2027-01-14', return_date: '2027-01-22', quota: 24, status: 'open' },
      { departure_date: '2027-02-11', return_date: '2027-02-19', quota: 8, status: 'limited' },
      { departure_date: '2027-03-18', return_date: '2027-03-26', quota: 30, status: 'open' },
    ],
  },
  {
    name: 'Umrah Madinah Tenang 12 Hari',
    slug: 'madinah-serenity-12d11n-umrah',
    description:
      'Dirancang khusus untuk keluarga dan jamaah lansia yang mengutamakan ritme perjalanan tenang 12 hari dengan 5 malam penuh di Madinah serta jeda istirahat terukur.',
    price: 39800000,
    duration_days: 12,
    duration_nights: 11,
    thumbnail: '/src/assets/images/package_madinah_courtyard_1795245601259.jpg',
    gallery: [
      '/src/assets/images/package_madinah_courtyard_1795245601259.jpg',
      '/src/assets/images/package_makkah_haram_1795245601010.jpg',
      '/src/assets/images/package_luxury_suite_1795245600782.jpg',
    ],
    airline: 'Garuda Indonesia (Langsung CGK – MED)',
    makkah_hotel: 'Swissotel Al Maqam Makkah (Contoh Bintang 5 · Akses Langsung Haram)',
    madinah_hotel: 'Dar Al Taqwa Madinah (Contoh Bintang 5 · Pelataran Depan)',
    included_facilities: [
      'Penerbangan langsung menuju Madinah (jadwal contoh)',
      'Akomodasi 5 malam di Madinah & 6 malam di Makkah',
      'Hidangan harian bernutrisi yang ramah bagi lansia & keluarga',
      'Transfer darat ramah kursi roda dan prioritas penanganan bagasi',
      'Dua Mutawif pendamping untuk setiap kelompok 35 jamaah',
      'Buku panduan Manasik, perlengkapan Ihram/Mukena, dan koper kabin',
    ],
    excluded_facilities: [
      'Tambahan biaya kamar privat satu orang (single supplement)',
      'Sertifikat vaksinasi meningitis atau vaksin musiman',
      'Kebutuhan medis pribadi maupun kelebihan bagasi maskapai',
    ],
    itinerary: [
      { day: 1, title: 'Penerbangan Langsung Jakarta ke Madinah', summary: 'Pendampingan check-in di Terminal 3, ketibaan langsung di Madinah, dan proses masuk kamar yang tertata.' },
      { day: 2, title: 'Orientasi Ringan di Masjid Nabawi', summary: 'Pengenalan gerbang masjid, ruang shalat, serta fasilitas ramah lansia di sekitar hotel.' },
      { day: 3, title: 'Kunjungan Raudhah & Kajian Sirah', summary: 'Kunjungan terjadwal ke Raudhah dilanjutkan kajian sejarah kota Madinah pada sore hari.' },
      { day: 4, title: 'Masjid Quba & Kebun Kurma Madinah', summary: 'Ziarah pagi ke Masjid Quba dan kebun kurma lokal dengan tempat istirahat teduh.' },
      { day: 5, title: 'Hari Ibadah Tenang di Madinah', summary: 'Hari khusus untuk memperbanyak ibadah dan doa sebelum menuju Makkah.' },
      { day: 6, title: 'Kereta Cepat ke Makkah & Pelaksanaan Umrah', summary: 'Mengambil Miqat di Dzulhulaifah, perjalanan Kereta Cepat Haramain, dan Umrah malam terpandu.' },
      { day: 7, title: 'Pemulihan & Shalat di Masjidil Haram', summary: 'Pagi hari untuk beristirahat setelah rangkaian Umrah dan shalat berjamaah di Haram.' },
      { day: 8, title: 'Jabal Nur & Warisan Sejarah Makkah', summary: 'Tur pagi melihat situs sejarah Makkah dari bus nyaman tanpa pendakian berat.' },
      { day: 9, title: 'Opsi Umrah Kedua via Hudaibiyah', summary: 'Pendampingan bagi jamaah yang ingin melaksanakan Umrah tambahan secara tenang.' },
      { day: 10, title: 'Ibadah Mandiri & Tadarus Al-Quran', summary: 'Sehari penuh di Masjidil Haram untuk doa, dzikir, dan tilawah.' },
      { day: 11, title: 'Tawaf Wada & Keberangkatan Jeddah', summary: 'Tawaf perpisahan dan penerbangan malam kembali ke Tanah Air melalui Jeddah.' },
      { day: 12, title: 'Tiba di Jakarta', summary: 'Tiba di Bandara Soekarno-Hatta dengan koordinasi pengambilan bagasi grup.' },
    ],
    departures: [
      { departure_date: '2027-01-25', return_date: '2027-02-05', quota: 18, status: 'open' },
      { departure_date: '2027-03-04', return_date: '2027-03-15', quota: 6, status: 'limited' },
    ],
  },
  {
    name: 'Umrah Awal Ramadhan 9 Hari',
    slug: 'ramadhan-essential-9d8n-umrah',
    description:
      'Program contoh sembilan hari yang disesuaikan untuk suasana ibadah awal Ramadhan, lengkap dengan pengaturan sahur dan berbuka puasa dekat pelataran Haramain.',
    price: 31900000,
    duration_days: 9,
    duration_nights: 8,
    thumbnail: '/src/assets/images/package_luxury_suite_1795245600782.jpg',
    gallery: [
      '/src/assets/images/package_luxury_suite_1795245600782.jpg',
      '/src/assets/images/package_makkah_haram_1795245601010.jpg',
      '/src/assets/images/package_madinah_courtyard_1795245601259.jpg',
    ],
    airline: 'Saudia Airlines / Emirates (Transit 1 Kali)',
    makkah_hotel: 'Voco Makkah by IHG (Contoh Bintang 4 Plus · Shuttle & Jalan Kaki)',
    madinah_hotel: 'Dallah Taibah Hotel (Contoh Bintang 4 Plus · ~180m ke Nabawi)',
    included_facilities: [
      'Tiket penerbangan internasional pulang-pergi dengan bagasi memadai',
      '4 malam Madinah & 4 malam Makkah pilihan kamar Quad/Triple/Double',
      'Hidangan Sahur & Berbuka Puasa harian serta kurma dan Zamzam',
      'Koordinasi logistik jamaah untuk shalat Tarawih & Qiyamullail',
      'Fasilitasi visa Umroh & perlindungan perjalanan grup',
    ],
    excluded_facilities: [
      'Belanja pribadi serta kudapan tambahan di luar jadwal Sahur/Iftar',
      'Penjemputan bandara privat di luar jadwal rombongan utama',
      'Biaya peningkatan kamar menghadap langsung pelataran Haram',
    ],
    itinerary: [
      { day: 1, title: 'Keberangkatan dari Jakarta', summary: 'Pertemuan grup, pemeriksaan dokumen contoh, dan penerbangan malam menuju Arab Saudi.' },
      { day: 2, title: 'Tiba di Madinah & Berbuka Bersama', summary: 'Check-in hotel di Madinah dan berbuka puasa bersama di dekat Masjid Nabawi.' },
      { day: 3, title: 'Ibadah Puasa & Shalat Tarawih', summary: 'Fokus berpuasa, tadarus Al-Quran, dan melaksanakan shalat Tarawih berjamaah.' },
      { day: 4, title: 'Ziarah Pagi Kota Madinah', summary: 'Kunjungan singkat pagi hari ke Masjid Quba dan Uhud agar tetap bugar saat berpuasa.' },
      { day: 5, title: 'Perjalanan ke Makkah & Umrah Malam', summary: 'Miqat di Bir Ali, perjalanan ke Makkah, berbuka puasa, dan Umrah pada malam hari yang sejuk.' },
      { day: 6, title: 'Kekhusyukan Ramadhan di Masjidil Haram', summary: 'Sahur bersama, shalat Subuh, istirahat siang, dan Qiyamullail.' },
      { day: 7, title: 'Ziarah Sekitar Makkah', summary: 'Tur pagi singkat melintasi area Mina dan Arafah sebelum waktu Dzuhur.' },
      { day: 8, title: 'Tawaf Wada & Penerbangan Pulang', summary: 'Shalat penutup di Masjidil Haram serta transfer sore menuju Bandara Jeddah.' },
      { day: 9, title: 'Kembali ke Indonesia', summary: 'Tiba di Bandara Soekarno-Hatta Jakarta pada siang hari.' },
    ],
    departures: [
      { departure_date: '2027-02-18', return_date: '2027-02-26', quota: 20, status: 'open' },
      { departure_date: '2027-03-08', return_date: '2027-03-16', quota: 12, status: 'limited' },
    ],
  },
  {
    name: 'Umrah Eksekutif Haramain 10 Hari',
    slug: 'haramain-executive-10d9n-umrah',
    description:
      'Program contoh grup kecil sepuluh hari berkapasitas maksimal 20 jamaah dengan layanan Kereta Cepat Haramain kelas bisnis dan kamar di pelataran utama.',
    price: 46500000,
    duration_days: 10,
    duration_nights: 9,
    thumbnail: '/src/assets/images/package_makkah_haram_1795245601010.jpg',
    gallery: [
      '/src/assets/images/package_makkah_haram_1795245601010.jpg',
      '/src/assets/images/package_luxury_suite_1795245600782.jpg',
      '/assets/aistudio/Gemini_Generated_Image_azm31razm31razm3_bd6b0af4.jfif',
    ],
    airline: 'Garuda Indonesia / Saudia (Kabin Prioritas Langsung)',
    makkah_hotel: 'Fairmont Makkah Clock Royal Tower (Contoh Bintang 5 · Pelataran Haram)',
    madinah_hotel: 'The Oberoi Madinah (Contoh Bintang 5 · Pelataran Utara Nabawi)',
    included_facilities: [
      'Penerbangan langsung pulang-pergi dengan akses lounge bandara (contoh)',
      '4 malam Madinah & 5 malam Makkah kategori kamar Premier',
      'Tiket Kereta Cepat Haramain Kelas Bisnis Madinah – Makkah',
      'Mutawif khusus grup kecil & pendampingan concierge lapangan',
      'Sajian prasmanan harian & fasilitas laundry terpaket',
    ],
    excluded_facilities: [
      'Layanan pengurusan visa jalur cepat privat apabila diminta terpisah',
      'Belanja pribadi serta layanan minibar kamar',
      'Perpanjangan wisata opsional menuju kota Taif',
    ],
    itinerary: [
      { day: 1, title: 'Lounge Eksekutif & Keberangkatan', summary: 'Pendampingan check-in privat di Jakarta dan penerbangan langsung menuju Madinah.' },
      { day: 2, title: 'Ketibaan & Akomodasi Pelataran Utama', summary: 'Penanganan bagasi ekspres menuju hotel tepat di pelataran Masjid Nabawi.' },
      { day: 3, title: 'Jadwal Raudhah & Kunjungan Quba', summary: 'Pendampingan akses Raudhah dan ziarah pagi yang nyaman.' },
      { day: 4, title: 'Kajian Sirah & Ibadah Pribadi', summary: 'Sesi refleksi sore eksklusif grup kecil bersama pembimbing ibadah.' },
      { day: 5, title: 'Kereta Cepat Bisnis menuju Makkah', summary: 'Keberangkatan pagi melalui Miqat Bir Ali dan perjalanan nyaman dengan Kereta Cepat Haramain.' },
      { day: 6, title: 'Umrah Pertama Terpandu & Pemulihan', summary: 'Tawaf dan Sai dipandu secara personal untuk kenyamanan rombongan kecil.' },
      { day: 7, title: 'Ibadah Penuh di Masjidil Haram', summary: 'Hari ibadah mandiri dengan akses pintu masjid langsung dari hotel.' },
      { day: 8, title: 'Warisan Makkah & Refleksi Arafah', summary: 'Ziarah menggunakan kendaraan MPV ber-AC yang tenang dan privat.' },
      { day: 9, title: 'Tawaf Wada & Lounge Bandara Jeddah', summary: 'Tawaf perpisahan dilanjutkan penerbangan malam kembali ke Indonesia.' },
      { day: 10, title: 'Tiba di Jakarta', summary: 'Tiba di Soekarno-Hatta dengan layanan pengantaran bagasi prioritas.' },
    ],
    departures: [
      { departure_date: '2027-01-30', return_date: '2027-02-08', quota: 10, status: 'limited' },
      { departure_date: '2027-04-09', return_date: '2027-04-18', quota: 16, status: 'open' },
    ],
  },
];

function initSqliteDb(): DbAdapter {
  const dbDir = path.resolve(process.cwd(), 'database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'safah_demo.sqlite');
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      duration_days INTEGER NOT NULL,
      duration_nights INTEGER NOT NULL,
      thumbnail TEXT NOT NULL,
      gallery TEXT NOT NULL,
      airline TEXT NOT NULL,
      makkah_hotel TEXT NOT NULL,
      madinah_hotel TEXT NOT NULL,
      included_facilities TEXT NOT NULL,
      excluded_facilities TEXT NOT NULL,
      itinerary TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
    CREATE INDEX IF NOT EXISTS idx_packages_price ON packages(price);

    CREATE TABLE IF NOT EXISTS departures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER NOT NULL,
      departure_date TEXT NOT NULL,
      return_date TEXT NOT NULL,
      quota INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'limited', 'full', 'closed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_departures_package_id ON departures(package_id);
    CREATE INDEX IF NOT EXISTS idx_departures_date ON departures(departure_date);
    CREATE INDEX IF NOT EXISTS idx_departures_status ON departures(status);

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER NOT NULL,
      departure_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NULL,
      participant_count INTEGER NOT NULL DEFAULT 1,
      message TEXT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE RESTRICT,
      FOREIGN KEY (departure_id) REFERENCES departures(id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_registrations_package_id ON registrations(package_id);
    CREATE INDEX IF NOT EXISTS idx_registrations_departure_id ON registrations(departure_id);
    CREATE INDEX IF NOT EXISTS idx_registrations_phone_departure ON registrations(phone, departure_id);
  `);

  const countRow = db.prepare('SELECT COUNT(*) AS count FROM packages').get() as { count: number };
  if (countRow.count === 0) {
    const insertPackage = db.prepare(`
      INSERT INTO packages (
        name, slug, description, price, duration_days, duration_nights,
        thumbnail, gallery, airline, makkah_hotel, madinah_hotel,
        included_facilities, excluded_facilities, itinerary, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `);

    const insertDeparture = db.prepare(`
      INSERT INTO departures (package_id, departure_date, return_date, quota, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    db.exec('BEGIN');
    try {
      for (const pkg of SEED_PACKAGES) {
        const res = insertPackage.run(
          pkg.name,
          pkg.slug,
          pkg.description,
          pkg.price,
          pkg.duration_days,
          pkg.duration_nights,
          pkg.thumbnail,
          JSON.stringify(pkg.gallery),
          pkg.airline,
          pkg.makkah_hotel,
          pkg.madinah_hotel,
          JSON.stringify(pkg.included_facilities),
          JSON.stringify(pkg.excluded_facilities),
          JSON.stringify(pkg.itinerary)
        );
        const packageId = Number(res.lastInsertRowid);
        for (const dep of pkg.departures) {
          insertDeparture.run(packageId, dep.departure_date, dep.return_date, dep.quota, dep.status);
        }
      }
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  } else {
    // Synchronize previously seeded English sample descriptions to Bahasa Indonesia without altering schema or registrations
    const sampleCheck = db
      .prepare("SELECT id FROM packages WHERE slug = 'safah-signature-9d8n-umrah' AND description LIKE '%demonstration itinerary%'")
      .get() as { id: number } | undefined;

    if (sampleCheck) {
      const updatePkg = db.prepare(`
        UPDATE packages SET
          name = ?,
          description = ?,
          airline = ?,
          makkah_hotel = ?,
          madinah_hotel = ?,
          included_facilities = ?,
          excluded_facilities = ?,
          itinerary = ?,
          updated_at = datetime('now')
        WHERE slug = ?
      `);

      db.exec('BEGIN');
      try {
        for (const pkg of SEED_PACKAGES) {
          updatePkg.run(
            pkg.name,
            pkg.description,
            pkg.airline,
            pkg.makkah_hotel,
            pkg.madinah_hotel,
            JSON.stringify(pkg.included_facilities),
            JSON.stringify(pkg.excluded_facilities),
            JSON.stringify(pkg.itinerary),
            pkg.slug
          );
        }
        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }
    }

    // Ensure gallery paths stay synchronized when image assets are updated
    db.prepare(`
      UPDATE packages
      SET gallery = replace(
        gallery,
        '/src/assets/images/about_travel_consultation_1795245601294.jpg',
        '/assets/aistudio/Gemini_Generated_Image_azm31razm31razm3_bd6b0af4.jfif'
      ),
      updated_at = datetime('now')
      WHERE gallery LIKE '%about_travel_consultation_1795245601294.jpg%'
    `).run();
  }

  const query = async <T = Record<string, unknown>>(sql: string, params: SqlParam[] = []): Promise<T[]> => {
    const stmt = db.prepare(sql);
    return stmt.all(...params) as T[];
  };

  const execute = async (sql: string, params: SqlParam[] = []): Promise<ExecuteResult> => {
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return {
      insertId: Number(result.lastInsertRowid ?? 0),
      affectedRows: Number(result.changes ?? 0),
    };
  };

  const transaction = async <T>(fn: (tx: Pick<DbAdapter, 'query' | 'execute'>) => Promise<T>): Promise<T> => {
    db.exec('BEGIN IMMEDIATE');
    try {
      const result = await fn({ query, execute });
      db.exec('COMMIT');
      return result;
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  };

  return { engine: 'sqlite', query, execute, transaction };
}

function initMysqlDb(): DbAdapter {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: false,
  });

  const query = async <T = Record<string, unknown>>(sql: string, params: SqlParam[] = []): Promise<T[]> => {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  };

  const execute = async (sql: string, params: SqlParam[] = []): Promise<ExecuteResult> => {
    const [result] = await pool.execute(sql, params);
    const header = result as mysql.ResultSetHeader;
    return {
      insertId: header.insertId ?? 0,
      affectedRows: header.affectedRows ?? 0,
    };
  };

  const transaction = async <T>(fn: (tx: Pick<DbAdapter, 'query' | 'execute'>) => Promise<T>): Promise<T> => {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const txQuery = async <R = Record<string, unknown>>(sql: string, params: SqlParam[] = []): Promise<R[]> => {
      const [rows] = await conn.execute(sql, params);
      return rows as R[];
    };
    const txExecute = async (sql: string, params: SqlParam[] = []): Promise<ExecuteResult> => {
      const [result] = await conn.execute(sql, params);
      const header = result as mysql.ResultSetHeader;
      return {
        insertId: header.insertId ?? 0,
        affectedRows: header.affectedRows ?? 0,
      };
    };
    try {
      const result = await fn({ query: txQuery, execute: txExecute });
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  };

  return { engine: 'mysql', query, execute, transaction };
}

export function getDb(): DbAdapter {
  if (adapter) {
    return adapter;
  }
  if (process.env.DB_HOST && process.env.DB_NAME) {
    adapter = initMysqlDb();
  } else {
    adapter = initSqliteDb();
  }
  return adapter;
}
