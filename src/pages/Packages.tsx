import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Search } from 'lucide-react';
import { ScrollRevealHeading } from '../components/common/AnimatedText.tsx';
import { SafahIslamicPattern } from '../components/common/IslamicGreenDecoration.tsx';
import {
  CARD_SPRING,
  RevealBlock,
  RevealParagraph,
} from '../components/common/MotionPrimitives.tsx';
import { PackageCard } from '../components/packages/PackageCard.tsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { extractApiErrorMessage } from '../services/api.ts';
import { fetchPackages } from '../services/packageService.ts';
import type { UmrahPackage } from '../types/travel.ts';
import { formatMonthLabel } from '../utils/formatters.ts';

const DURATION_OPTIONS = [
  { label: 'Semua Durasi', value: '' },
  { label: '9 Hari', value: '9' },
  { label: '10 Hari', value: '10' },
  { label: '12 Hari', value: '12' },
];

const MONTH_OPTIONS = ['2027-01', '2027-02', '2027-03', '2027-04'];

export default function Packages() {
  useDocumentMeta(
    'Paket Umroh – Baitullah Journey',
    'Telusuri dan saring pilihan paket Umroh contoh berdasarkan bulan keberangkatan, durasi perjalanan, hotel, dan perkiraan biaya.'
  );

  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [sortBy, setSortBy] = useState<
    'departure_asc' | 'price_asc' | 'price_desc' | 'duration_asc'
  >('departure_asc');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPackages({
        search: debouncedSearch || undefined,
        duration: selectedDuration ? Number(selectedDuration) : undefined,
        month: selectedMonth || undefined,
        sort: sortBy,
        limit: 24,
      });
      setPackages(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(extractApiErrorMessage(err, 'Gagal memuat daftar paket Umroh.'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedDuration, selectedMonth, sortBy]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const handleReset = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedDuration('');
    setSelectedMonth('');
    setSortBy('departure_asc');
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-brand-forest py-14 text-brand-white">
        <SafahIslamicPattern variant="card" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RevealBlock variant="fadeDown" immediate>
            <p className="text-breath-periwinkle text-xs font-semibold tracking-wide uppercase">
              Katalog Program Contoh · Data Simulasi
            </p>
          </RevealBlock>
          <ScrollRevealHeading
            as="h1"
            className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-white sm:text-4xl"
          >
            Paket Umroh &amp;{' '}
            <span className="text-animated-periwinkle-dark">
              Jadwal Keberangkatan
            </span>
          </ScrollRevealHeading>
          <RevealParagraph
            immediate
            delay={0.1}
            className="mt-3 max-w-2xl text-base leading-relaxed text-brand-white/85"
          >
            Cari berdasarkan nama paket, hotel di Makkah atau Madinah, maupun saring menurut bulan keberangkatan dan durasi perjalanan.
          </RevealParagraph>

          {/* Bilah Pencarian & Filter */}
          <RevealBlock variant="scaleIn" delay={0.14} immediate>
            <div className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-brand-border bg-brand-white p-4 text-brand-charcoal shadow-xs sm:grid-cols-12">
            <div className="relative sm:col-span-5">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand-teal"
                aria-hidden="true"
              />
              <label htmlFor="package-search" className="sr-only">
                Cari nama paket, hotel, atau maskapai
              </label>
              <input
                id="package-search"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari paket, hotel, atau maskapai..."
                className="w-full rounded-lg border border-brand-border bg-brand-surface py-2.5 pr-4 pl-10 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="month-filter" className="sr-only">
                Filter bulan keberangkatan
              </label>
              <select
                id="month-filter"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-lg border border-brand-border bg-brand-surface px-3.5 py-2.5 text-sm text-brand-charcoal focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
              >
                <option value="">Semua Bulan Keberangkatan</option>
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="sort-select" className="sr-only">
                Urutkan paket
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'departure_asc'
                      | 'price_asc'
                      | 'price_desc'
                      | 'duration_asc'
                  )
                }
                className="w-full rounded-lg border border-brand-border bg-brand-surface px-3.5 py-2.5 text-sm text-brand-charcoal focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
              >
                <option value="departure_asc">
                  Urutkan: Keberangkatan Terdekat
                </option>
                <option value="price_asc">Urutkan: Biaya Terendah</option>
                <option value="price_desc">Urutkan: Biaya Tertinggi</option>
                <option value="duration_asc">
                  Urutkan: Durasi Tersingkat
                </option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 sm:col-span-12">
              <div
                role="group"
                aria-label="Filter durasi perjalanan"
                className="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-brand-border bg-brand-surface p-1"
              >
                {DURATION_OPTIONS.map((opt) => {
                  const active = selectedDuration === opt.value;
                  return (
                    <motion.button
                      key={opt.label}
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      transition={CARD_SPRING}
                      onClick={() => setSelectedDuration(opt.value)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                        active
                          ? 'btn-primary-teal'
                          : 'border border-transparent text-brand-charcoal hover:bg-brand-white hover:text-brand-teal'
                      }`}
                    >
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>

              <span className="text-xs font-medium text-brand-text-secondary tabular-nums">
                Menampilkan {packages.length} dari {total} paket contoh
              </span>
            </div>
            </div>
          </RevealBlock>
        </div>
        <div className="divider-periwinkle-shimmer absolute right-0 bottom-0 left-0" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[440px] animate-pulse rounded-xl border border-brand-border bg-brand-surface p-6"
              />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-[#D9827A] bg-brand-white p-10 text-center"
          >
            <p className="text-base font-semibold text-[#7A271E]">
              Terjadi Kesalahan Memuat Paket
            </p>
            <p className="mt-2 text-sm text-brand-charcoal/80">{error}</p>
            <button
              type="button"
              onClick={loadPackages}
              className="btn-primary-teal mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <RotateCcw className="h-4 w-4 text-current" aria-hidden="true" />
              <span>Coba Lagi</span>
            </button>
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-xl border border-brand-border bg-brand-white p-12 text-center shadow-xs">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-brand-forest">
              Data Belum Tersedia untuk Kriteria Ini
            </h2>
            <p className="mt-2 text-sm text-brand-charcoal/80">
              Coba hapus kata kunci pencarian atau pilih bulan keberangkatan lainnya.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="btn-primary-teal mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <RotateCcw className="h-4 w-4 text-current" aria-hidden="true" />
              <span>Atur Ulang Filter</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, idx) => (
              <PackageCard key={pkg.id} pkg={pkg} index={idx} />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
}
