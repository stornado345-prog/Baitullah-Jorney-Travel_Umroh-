# SAFAH Travel — Platform Digital & Portofolio Perjalanan Umroh

SAFAH Travel adalah proyek portofolio full-stack untuk website perusahaan travel Umroh Indonesia dengan identitas visual **Deep Forest Green · Deep Teal · Soft Periwinkle · Pure White**.

> **Pemberitahuan Portofolio:** Seluruh paket Umroh, jadwal keberangkatan, alamat kantor, kontak, dan profil tim adalah data simulasi demonstrasi. SAFAH Travel tidak mengklaim izin PPIU resmi Kementerian Agama RI dan tidak melayani transaksi komersial nyata.

---

## Teknologi Utama

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router DOM, Axios, React Hook Form, Zod, Lucide React
- **Backend:** Node.js, Express.js, Helmet, CORS, Express Rate Limit, Zod
- **Database:** Dual-mode SQL (`mysql2` untuk MySQL produksi, serta `node:sqlite` lokal otomatis sebagai fallback siap-jalan saat variabel `DB_HOST` belum dikonfigurasi)

---

## Struktur Direktori

```text
├── backend/
│   └── src/
│       ├── config/database.ts        # Koneksi MySQL / SQLite lokal + seed Bahasa Indonesia
│       ├── middleware/               # Error handler & validasi Zod request
│       ├── modules/
│       │   ├── packages/             # Controller, service, repository, routes paket Umroh
│       │   ├── departures/           # Jadwal keberangkatan & sisa kuota
│       │   └── registrations/        # Pendaftaran minat jamaah + anti-duplikasi
│       ├── routes/index.ts           # Agregasi rute /api/*
│       └── app.ts                    # Konfigurasi Express app
├── database/
│   ├── schema.sql                    # Skema MySQL (packages, departures, registrations)
│   └── seed.sql                      # Data contoh paket & jadwal keberangkatan
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── common/                   # GreenCrescentDecoration, FloatingWhatsApp, MediaImage
│   │   ├── forms/                    # RegistrationForm (React Hook Form + Zod)
│   │   ├── layout/                   # Navbar, Footer
│   │   └── packages/                 # PackageCard
│   ├── pages/                        # Home, Packages, PackageDetail, About, Registration, Contact, NotFound
│   ├── services/                     # Axios client & API service helpers
│   ├── utils/                        # formatters, whatsapp helper, contactConfig
│   ├── index.css                     # Palet Classic Aristocrat & .bg-champagne-to-emerald
│   └── main.tsx
├── server.ts                         # Entry point Express + Vite middleware (port 3000)
└── .env.example                      # Contoh variabel lingkungan
```

---

## Menjalankan Proyek Secara Lokal

### 1. Instalasi Dependensi

```bash
npm install
```

### 2. Konfigurasi Variabel Lingkungan

Salin `.env.example` menjadi `.env` dan sesuaikan nilai yang dibutuhkan:

```env
PORT=3000
VITE_API_BASE_URL="/api"
VITE_WHATSAPP_NUMBER="6281200000000"
VITE_CONTACT_EMAIL="halo@safah-travel-demo.example"
VITE_OFFICE_ADDRESS="Jl. Contoh Kebayoran Baru No. 18, Jakarta Selatan 12160, Indonesia (Alamat Simulasi)"

# Opsional: Isi bila ingin menghubungkan ke server MySQL
DB_HOST=""
DB_PORT="3306"
DB_NAME="safah_travel"
DB_USER=""
DB_PASSWORD=""
```

### 3. Persiapan Database MySQL (Opsional)

Jika menggunakan MySQL eksternal, jalankan skrip skema dan data contoh:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p safah_travel < database/seed.sql
```

Apabila `DB_HOST` tidak diisi, server otomatis menginisialisasi basis data lokal SQLite di `database/safah_demo.sqlite` lengkap dengan tabel dan data contoh berbahasa Indonesia.

### 4. Menjalankan Mode Pengembangan

```bash
npm run dev
```

Aplikasi dan API berjalan pada `http://localhost:3000`.

### 5. Build & Menjalankan Mode Produksi

```bash
npm run build
npm start
```

---

## Ringkasan Endpoint REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status kesehatan server & koneksi database |
| `GET` | `/api/packages` | Daftar paket dengan filter (`search`, `duration`, `month`, `sort`, `limit`) |
| `GET` | `/api/packages/:slug` | Detail lengkap paket berdasarkan slug |
| `GET` | `/api/packages/:id/departures` | Jadwal keberangkatan & sisa kursi contoh untuk paket terkait |
| `POST` | `/api/registrations` | Validasi & penyimpanan pendaftaran minat jamaah (dengan pencegahan duplikasi & pengurangan kuota atomik) |
| `GET` | `/api/registrations/:id` | Mengambil ringkasan referensi pendaftaran contoh |
