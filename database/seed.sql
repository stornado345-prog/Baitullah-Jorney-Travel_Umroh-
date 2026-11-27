-- Data Contoh Awal SAFAH Travel (Portofolio Demonstrasi)
-- Seluruh paket, jadwal, hotel, dan kuota merupakan data simulasi.

INSERT INTO packages (
  name,
  slug,
  description,
  price,
  duration_days,
  duration_nights,
  thumbnail,
  gallery,
  airline,
  makkah_hotel,
  madinah_hotel,
  included_facilities,
  excluded_facilities,
  itinerary,
  status
) VALUES
(
  'Umrah Safah Signature 9 Hari',
  'safah-signature-9d8n-umrah',
  'Program contoh sembilan hari yang memadukan penerbangan langsung Jakarta–Jeddah dengan hotel bintang lima di pelataran Masjidil Haram dan Masjid Nabawi.',
  34500000.00,
  9,
  8,
  '/src/assets/images/package_makkah_haram_1795245601010.jpg',
  JSON_ARRAY(
    '/src/assets/images/package_makkah_haram_1795245601010.jpg',
    '/src/assets/images/package_luxury_suite_1795245600782.jpg',
    '/src/assets/images/package_madinah_courtyard_1795245601259.jpg'
  ),
  'Saudia Airlines (Langsung CGK – JED)',
  'Pullman Zamzam Makkah (Contoh Bintang 5 · ~150m ke Haram)',
  'Anwar Al Madinah Movenpick (Contoh Bintang 5 · ~120m ke Nabawi)',
  JSON_ARRAY(
    'Tiket pesawat pulang-pergi kelas ekonomi (rute demonstrasi)',
    'Akomodasi hotel 4 malam di Madinah & 4 malam di Makkah',
    'Konsumsi 3 kali sehari menu Nusantara & internasional',
    'Pengurusan visa Umroh & asuransi perjalanan (contoh fasilitas)',
    'Pembimbing ibadah (Mutawif) & koordinator grup berbahasa Indonesia',
    'Transportasi bus ber-AC & segmen Kereta Cepat Haramain',
    'Sesi bimbingan Manasik pra-keberangkatan & air Zamzam 5 liter'
  ),
  JSON_ARRAY(
    'Biaya pembuatan atau perpanjangan paspor',
    'Tiket penerbangan domestik dari luar Jakarta',
    'Laundry pribadi, layanan kamar, dan kebutuhan telepon',
    'Ziarah tambahan di luar jadwal utama program'
  ),
  JSON_ARRAY(
    JSON_OBJECT('day', 1, 'title', 'Keberangkatan Jakarta & Tiba di Madinah', 'summary', 'Berkumpul di Terminal 3 Bandara Soekarno-Hatta untuk pengarahan grup, penerbangan langsung, dan check-in hotel di Madinah.'),
    JSON_OBJECT('day', 2, 'title', 'Ibadah di Masjid Nabawi & Orientasi Raudhah', 'summary', 'Shalat berjamaah di Masjid Nabawi dilanjutkan orientasi jadwal kunjungan Raudhah serta pengenalan area pelataran.'),
    JSON_OBJECT('day', 3, 'title', 'Ziarah Sejarah Kota Madinah', 'summary', 'Kunjungan pagi terpandu menuju Masjid Quba, Jabal Uhud, dan Masjid Qiblatain, kembali sebelum waktu Dzuhur.'),
    JSON_OBJECT('day', 4, 'title', 'Refleksi Ibadah & Persiapan Miqat', 'summary', 'Waktu ibadah mandiri di Madinah dan pembekalan teknis tata cara Ihram bersama Mutawif pada malam hari.'),
    JSON_OBJECT('day', 5, 'title', 'Miqat Bir Ali & Umrah Pertama di Makkah', 'summary', 'Bertolak menuju Makkah via kereta cepat atau bus setelah Dzuhur, berniat Ihram di Bir Ali, dan melaksanakan Tawaf serta Sai Umrah.'),
    JSON_OBJECT('day', 6, 'title', 'Fokus Ibadah di Masjidil Haram', 'summary', 'Hari ibadah mandiri di Masjidil Haram dengan pilihan kajian sore yang tenang bersama pembimbing.'),
    JSON_OBJECT('day', 7, 'title', 'Ziarah Kota Makkah & Umrah Kedua', 'summary', 'Mengunjungi Jabal Rahmah, Arafah, Muzdalifah, dan Mina; tersedia opsi Miqat di Jiranah untuk Umrah kedua.'),
    JSON_OBJECT('day', 8, 'title', 'Tawaf Wada & Transfer ke Bandara Jeddah', 'summary', 'Pelaksanaan Tawaf Wada perpisahan pada pagi hari dan pengantaran menuju Bandara Internasional King Abdulaziz Jeddah.'),
    JSON_OBJECT('day', 9, 'title', 'Tiba Kembali di Jakarta', 'summary', 'Mendarat di Bandara Soekarno-Hatta Jakarta dan selesainya rangkaian perjalanan contoh.')
  ),
  'active'
),
(
  'Umrah Madinah Tenang 12 Hari',
  'madinah-serenity-12d11n-umrah',
  'Dirancang khusus untuk keluarga dan jamaah lansia yang mengutamakan ritme perjalanan tenang 12 hari dengan 5 malam penuh di Madinah serta jeda istirahat terukur.',
  39800000.00,
  12,
  11,
  '/src/assets/images/package_madinah_courtyard_1795245601259.jpg',
  JSON_ARRAY(
    '/src/assets/images/package_madinah_courtyard_1795245601259.jpg',
    '/src/assets/images/package_makkah_haram_1795245601010.jpg',
    '/src/assets/images/package_luxury_suite_1795245600782.jpg'
  ),
  'Garuda Indonesia (Langsung CGK – MED)',
  'Swissotel Al Maqam Makkah (Contoh Bintang 5 · Akses Langsung Haram)',
  'Dar Al Taqwa Madinah (Contoh Bintang 5 · Pelataran Depan)',
  JSON_ARRAY(
    'Penerbangan langsung menuju Madinah (jadwal contoh)',
    'Akomodasi 5 malam di Madinah & 6 malam di Makkah',
    'Hidangan harian bernutrisi yang ramah bagi lansia & keluarga',
    'Transfer darat ramah kursi roda dan prioritas penanganan bagasi',
    'Dua Mutawif pendamping untuk setiap kelompok 35 jamaah',
    'Buku panduan Manasik, perlengkapan Ihram/Mukena, dan koper kabin'
  ),
  JSON_ARRAY(
    'Tambahan biaya kamar privat satu orang (single supplement)',
    'Sertifikat vaksinasi meningitis atau vaksin musiman',
    'Kebutuhan medis pribadi maupun kelebihan bagasi maskapai'
  ),
  JSON_ARRAY(
    JSON_OBJECT('day', 1, 'title', 'Penerbangan Langsung Jakarta ke Madinah', 'summary', 'Pendampingan check-in di Terminal 3, ketibaan langsung di Madinah, dan proses masuk kamar yang tertata.'),
    JSON_OBJECT('day', 2, 'title', 'Orientasi Ringan di Masjid Nabawi', 'summary', 'Pengenalan gerbang masjid, ruang shalat, serta fasilitas ramah lansia di sekitar hotel.'),
    JSON_OBJECT('day', 3, 'title', 'Kunjungan Raudhah & Kajian Sirah', 'summary', 'Kunjungan terjadwal ke Raudhah dilanjutkan kajian sejarah kota Madinah pada sore hari.'),
    JSON_OBJECT('day', 4, 'title', 'Masjid Quba & Kebun Kurma Madinah', 'summary', 'Ziarah pagi ke Masjid Quba dan kebun kurma lokal dengan tempat istirahat teduh.'),
    JSON_OBJECT('day', 5, 'title', 'Hari Ibadah Tenang di Madinah', 'summary', 'Hari khusus untuk memperbanyak ibadah dan doa sebelum menuju Makkah.'),
    JSON_OBJECT('day', 6, 'title', 'Kereta Cepat ke Makkah & Pelaksanaan Umrah', 'summary', 'Mengambil Miqat di Dzulhulaifah, perjalanan Kereta Cepat Haramain, dan Umrah malam terpandu.'),
    JSON_OBJECT('day', 7, 'title', 'Pemulihan & Shalat di Masjidil Haram', 'summary', 'Pagi hari untuk beristirahat setelah rangkaian Umrah dan shalat berjamaah di Haram.'),
    JSON_OBJECT('day', 8, 'title', 'Jabal Nur & Warisan Sejarah Makkah', 'summary', 'Tur pagi melihat situs sejarah Makkah dari bus nyaman tanpa pendakian berat.'),
    JSON_OBJECT('day', 9, 'title', 'Opsi Umrah Kedua via Hudaibiyah', 'summary', 'Pendampingan bagi jamaah yang ingin melaksanakan Umrah tambahan secara tenang.'),
    JSON_OBJECT('day', 10, 'title', 'Ibadah Mandiri & Tadarus Al-Quran', 'summary', 'Sehari penuh di Masjidil Haram untuk doa, dzikir, dan tilawah.'),
    JSON_OBJECT('day', 11, 'title', 'Tawaf Wada & Keberangkatan Jeddah', 'summary', 'Tawaf perpisahan dan penerbangan malam kembali ke Tanah Air melalui Jeddah.'),
    JSON_OBJECT('day', 12, 'title', 'Tiba di Jakarta', 'summary', 'Tiba di Bandara Soekarno-Hatta dengan koordinasi pengambilan bagasi grup.')
  ),
  'active'
),
(
  'Umrah Awal Ramadhan 9 Hari',
  'ramadhan-essential-9d8n-umrah',
  'Program contoh sembilan hari yang disesuaikan untuk suasana ibadah awal Ramadhan, lengkap dengan pengaturan sahur dan berbuka puasa dekat pelataran Haramain.',
  31900000.00,
  9,
  8,
  '/src/assets/images/package_luxury_suite_1795245600782.jpg',
  JSON_ARRAY(
    '/src/assets/images/package_luxury_suite_1795245600782.jpg',
    '/src/assets/images/package_makkah_haram_1795245601010.jpg',
    '/src/assets/images/package_madinah_courtyard_1795245601259.jpg'
  ),
  'Saudia Airlines / Emirates (Transit 1 Kali)',
  'Voco Makkah by IHG (Contoh Bintang 4 Plus · Shuttle & Jalan Kaki)',
  'Dallah Taibah Hotel (Contoh Bintang 4 Plus · ~180m ke Nabawi)',
  JSON_ARRAY(
    'Tiket penerbangan internasional pulang-pergi dengan bagasi memadai',
    '4 malam Madinah & 4 malam Makkah pilihan kamar Quad/Triple/Double',
    'Hidangan Sahur & Berbuka Puasa harian serta kurma dan Zamzam',
    'Koordinasi logistik jamaah untuk shalat Tarawih & Qiyamullail',
    'Fasilitasi visa Umroh & perlindungan perjalanan grup'
  ),
  JSON_ARRAY(
    'Belanja pribadi serta kudapan tambahan di luar jadwal Sahur/Iftar',
    'Penjemputan bandara privat di luar jadwal rombongan utama',
    'Biaya peningkatan kamar menghadap langsung pelataran Haram'
  ),
  JSON_ARRAY(
    JSON_OBJECT('day', 1, 'title', 'Keberangkatan dari Jakarta', 'summary', 'Pertemuan grup, pemeriksaan dokumen contoh, dan penerbangan malam menuju Arab Saudi.'),
    JSON_OBJECT('day', 2, 'title', 'Tiba di Madinah & Berbuka Bersama', 'summary', 'Check-in hotel di Madinah dan berbuka puasa bersama di dekat Masjid Nabawi.'),
    JSON_OBJECT('day', 3, 'title', 'Ibadah Puasa & Shalat Tarawih', 'summary', 'Fokus berpuasa, tadarus Al-Quran, dan melaksanakan shalat Tarawih berjamaah.'),
    JSON_OBJECT('day', 4, 'title', 'Ziarah Pagi Kota Madinah', 'summary', 'Kunjungan singkat pagi hari ke Masjid Quba dan Uhud agar tetap bugar saat berpuasa.'),
    JSON_OBJECT('day', 5, 'title', 'Perjalanan ke Makkah & Umrah Malam', 'summary', 'Miqat di Bir Ali, perjalanan ke Makkah, berbuka puasa, dan Umrah pada malam hari yang sejuk.'),
    JSON_OBJECT('day', 6, 'title', 'Kekhusyukan Ramadhan di Masjidil Haram', 'summary', 'Sahur bersama, shalat Subuh, istirahat siang, dan Qiyamullail.'),
    JSON_OBJECT('day', 7, 'title', 'Ziarah Sekitar Makkah', 'summary', 'Tur pagi singkat melintasi area Mina dan Arafah sebelum waktu Dzuhur.'),
    JSON_OBJECT('day', 8, 'title', 'Tawaf Wada & Penerbangan Pulang', 'summary', 'Shalat penutup di Masjidil Haram serta transfer sore menuju Bandara Jeddah.'),
    JSON_OBJECT('day', 9, 'title', 'Kembali ke Indonesia', 'summary', 'Tiba di Bandara Soekarno-Hatta Jakarta pada siang hari.')
  ),
  'active'
);

INSERT INTO departures (package_id, departure_date, return_date, quota, status) VALUES
(1, '2027-01-14', '2027-01-22', 24, 'open'),
(1, '2027-02-11', '2027-02-19', 8, 'limited'),
(1, '2027-03-18', '2027-03-26', 30, 'open'),
(2, '2027-01-25', '2027-02-05', 18, 'open'),
(2, '2027-03-04', '2027-03-15', 6, 'limited'),
(3, '2027-02-18', '2027-02-26', 20, 'open'),
(3, '2027-03-08', '2027-03-16', 12, 'limited');
