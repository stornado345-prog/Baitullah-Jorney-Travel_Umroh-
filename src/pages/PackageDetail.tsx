import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  MessageCircle,
  Plane,
  X,
} from 'lucide-react';
import { ScrollRevealHeading } from '../components/common/AnimatedText.tsx';
import { MediaImage } from '../components/common/MediaImage.tsx';
import {
  CARD_SPRING,
  InteractiveCard,
  ParallaxFrame,
  RevealBlock,
  SMOOTH_EASE,
} from '../components/common/MotionPrimitives.tsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { extractApiErrorMessage } from '../services/api.ts';
import {
  fetchPackageBySlug,
  fetchPackageDepartures,
} from '../services/packageService.ts';
import type { Departure, UmrahPackage } from '../types/travel.ts';
import {
  formatDateLong,
  formatDepartureStatusLabel,
  formatIDR,
} from '../utils/formatters.ts';
import { buildWhatsAppUrl } from '../utils/whatsapp.ts';

export default function PackageDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [pkg, setPkg] = useState<UmrahPackage | null>(null);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(
    null
  );
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useDocumentMeta(
    pkg ? `${pkg.name} – Baitullah Journey` : 'Detail Paket – Baitullah Journey',
    pkg
      ? pkg.description
      : 'Tinjau rincian itinerary Umroh, fasilitas hotel, maskapai, dan jadwal keberangkatan.'
  );

  useEffect(() => {
    if (!slug) return;
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const packageData = await fetchPackageBySlug(slug!);
        if (!active) return;
        setPkg(packageData);
        setActiveImage(packageData.gallery?.[0] || packageData.thumbnail);

        const deps = await fetchPackageDepartures(packageData.id);
        if (!active) return;
        setDepartures(deps);
        const firstAvailable = deps.find(
          (d) => d.status !== 'full' && d.status !== 'closed' && d.quota > 0
        );
        setSelectedDepartureId(
          firstAvailable ? firstAvailable.id : (deps[0]?.id ?? null)
        );
      } catch (err) {
        if (!active) return;
        setError(
          extractApiErrorMessage(err, 'Detail paket Umroh tidak dapat dimuat.')
        );
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  const selectedDeparture = departures.find(
    (d) => d.id === selectedDepartureId
  );
  const galleryImages = pkg
    ? Array.from(
        new Set([pkg.thumbnail, ...(pkg.gallery || [])].filter(Boolean))
      )
    : [];

  return (
    <MainLayout
      whatsappContext={
        pkg
          ? {
              packageName: pkg.name,
              departureDate: selectedDeparture?.departure_date,
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/packages"
          className="underline-animated-periwinkle inline-flex items-center gap-2 pb-1 text-sm font-medium text-brand-teal transition-colors hover:text-brand-forest"
        >
          <ArrowLeft className="h-4 w-4 text-current" aria-hidden="true" />
          <span>Kembali ke Daftar Paket Umroh</span>
        </Link>

        {loading ? (
          <div className="mt-8 space-y-6">
            <div className="h-96 animate-pulse rounded-xl border border-brand-border bg-brand-surface" />
            <div className="h-56 animate-pulse rounded-xl border border-brand-border bg-brand-surface" />
          </div>
        ) : error || !pkg ? (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-brand-border bg-brand-white p-12 text-center shadow-xs"
          >
            <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-brand-forest">
              Paket Tidak Ditemukan
            </h1>
            <p className="mt-2 text-sm text-brand-charcoal/80">
              {error || 'Paket Umroh yang Anda cari belum tersedia.'}
            </p>
            <Link
              to="/packages"
              className="btn-primary-teal mt-6 inline-flex items-center px-5 py-2.5 text-sm"
            >
              Lihat Paket Tersedia
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-14">
            {/* Ringkasan & Galeri */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <RevealBlock variant="slideLeft" immediate className="space-y-4 lg:col-span-7">
                <ParallaxFrame
                  immediate
                  className="aspect-[4/3] rounded-xl border border-brand-border bg-brand-surface shadow-xs"
                >
                  <MediaImage
                    src={activeImage || pkg.thumbnail}
                    alt={`${pkg.name} — tampilan galeri utama`}
                    priority
                    className="h-full w-full object-cover"
                  />
                </ParallaxFrame>
                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {galleryImages.map((imgUrl, idx) => {
                      const isCurrent = imgUrl === activeImage;
                      return (
                        <motion.button
                          key={imgUrl}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          transition={CARD_SPRING}
                          onClick={() => setActiveImage(imgUrl)}
                          aria-label={`Lihat gambar galeri ${idx + 1}`}
                          className={`aspect-[4/3] overflow-hidden rounded-lg border transition-all ${
                            isCurrent
                              ? 'border-brand-teal ring-2 ring-brand-teal/30'
                              : 'border-brand-border opacity-80 hover:border-brand-teal hover:opacity-100'
                          }`}
                        >
                          <MediaImage
                            src={imgUrl}
                            alt={`${pkg.name} — gambar ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </RevealBlock>

              {/* Kartu Spesifikasi & Pilih Keberangkatan */}
              <RevealBlock variant="slideRight" immediate delay={0.08} className="lg:col-span-5">
                <div className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs sm:p-8">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-brand-text-secondary">
                    <span className="tabular-nums">
                      {pkg.duration_days} Hari · {pkg.duration_nights} Malam
                    </span>
                    <span aria-hidden="true" className="text-brand-teal">
                      ·
                    </span>
                    <span>Paket Contoh Demonstrasi</span>
                  </div>

                  <ScrollRevealHeading
                    as="h1"
                    className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-brand-forest sm:text-3xl"
                  >
                    <span className="text-animated-periwinkle-light">{pkg.name}</span>
                  </ScrollRevealHeading>

                  <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/85">
                    {pkg.description}
                  </p>

                  <div className="-mx-6 mt-6 border-y border-brand-border bg-brand-surface px-6 py-4 sm:-mx-8 sm:px-8">
                    <span className="block text-xs text-brand-text-secondary">
                      Perkiraan biaya per jamaah (kamar Quad)
                    </span>
                    <span className="mt-1 block font-['Plus_Jakarta_Sans'] text-2xl font-bold text-brand-forest tabular-nums">
                      {formatIDR(pkg.price)}
                    </span>
                  </div>

                  <dl className="mt-5 space-y-3 text-sm text-brand-charcoal">
                    <div className="flex items-start gap-3">
                      <Plane
                        className="mt-1 h-4 w-4 shrink-0 text-brand-teal"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-brand-text-secondary">
                          Maskapai Penerbangan
                        </dt>
                        <dd className="font-semibold text-brand-charcoal">
                          {pkg.airline}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2
                        className="mt-1 h-4 w-4 shrink-0 text-brand-teal"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-brand-text-secondary">
                          Hotel Makkah
                        </dt>
                        <dd className="font-semibold text-brand-charcoal">
                          {pkg.makkah_hotel}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2
                        className="mt-1 h-4 w-4 shrink-0 text-brand-teal"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-xs text-brand-text-secondary">
                          Hotel Madinah
                        </dt>
                        <dd className="font-semibold text-brand-charcoal">
                          {pkg.madinah_hotel}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  {/* Pemilih Jadwal Keberangkatan */}
                  <div className="mt-6 border-t border-brand-border pt-5">
                    <p className="text-xs font-semibold text-brand-forest">
                      Pilih Jadwal Keberangkatan Contoh
                    </p>
                    {departures.length === 0 ? (
                      <p className="mt-2 text-xs text-brand-text-secondary">
                        Belum ada jadwal keberangkatan yang ditampilkan. Silakan hubungi tim melalui WhatsApp.
                      </p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {departures.map((dep) => {
                          const isSelected = dep.id === selectedDepartureId;
                          const isUnavailable =
                            dep.status === 'full' ||
                            dep.status === 'closed' ||
                            dep.quota <= 0;
                          return (
                            <motion.button
                              key={dep.id}
                              type="button"
                              disabled={isUnavailable}
                              whileHover={isUnavailable ? undefined : { scale: 1.015 }}
                              whileTap={isUnavailable ? undefined : { scale: 0.98 }}
                              transition={CARD_SPRING}
                              onClick={() => setSelectedDepartureId(dep.id)}
                              className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-xs transition-colors ${
                                isSelected
                                  ? 'btn-primary-teal'
                                  : 'border-brand-border bg-brand-surface font-medium text-brand-charcoal hover:border-brand-teal hover:bg-brand-white'
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              <span className="flex items-center gap-2 font-medium text-current tabular-nums">
                                <Calendar
                                  className="h-3.5 w-3.5 text-current"
                                  aria-hidden="true"
                                />
                                {formatDateLong(dep.departure_date)} –{' '}
                                {formatDateLong(dep.return_date)}
                              </span>
                              <span className="font-semibold text-current tabular-nums whitespace-nowrap">
                                {formatDepartureStatusLabel(
                                  dep.status,
                                  dep.quota
                                )}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      to={`/register?packageId=${pkg.id}${
                        selectedDeparture
                          ? `&departureId=${selectedDeparture.id}`
                          : ''
                      }`}
                      className="btn-primary-teal inline-flex w-full items-center justify-center px-5 py-3 text-sm"
                    >
                      Daftar Sekarang untuk Paket Ini
                    </Link>

                    <a
                      href={buildWhatsAppUrl({
                        packageName: pkg.name,
                        departureDate: selectedDeparture?.departure_date,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary-outline inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 text-sm"
                    >
                      <MessageCircle
                        className="h-4 w-4 text-current"
                        aria-hidden="true"
                      />
                      <span>Konsultasi via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </RevealBlock>
            </div>

            {/* Fasilitas Termasuk & Tidak Termasuk */}
            <section className="grid grid-cols-1 gap-8 border-t border-brand-border pt-12 md:grid-cols-2">
              <InteractiveCard
                index={0}
                variant="slideLeft"
                className="rounded-xl border border-brand-border bg-brand-white p-7 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
              >
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-brand-forest">
                  Fasilitas Termasuk
                </h2>
                <ul className="mt-5 space-y-3">
                  {pkg.included_facilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-brand-charcoal/90"
                    >
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-brand-teal"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </InteractiveCard>

              <InteractiveCard
                index={1}
                variant="slideRight"
                className="rounded-xl border border-brand-border bg-brand-white p-7 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
              >
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-brand-forest">
                  Fasilitas Tidak Termasuk
                </h2>
                <ul className="mt-5 space-y-3">
                  {pkg.excluded_facilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-brand-charcoal/90"
                    >
                      <X
                        className="mt-1 h-4 w-4 shrink-0 text-brand-text-secondary"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </InteractiveCard>
            </section>

            {/* Rencana Perjalanan Harian (Itinerary) */}
            <section className="border-t border-brand-border pt-12">
              <RevealBlock variant="fadeUp" className="max-w-2xl">
                <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
                  Rencana Perjalanan Contoh
                </p>
                <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold text-brand-forest">
                  <span className="text-animated-periwinkle-light">
                    Itinerary Harian
                  </span>{' '}
                  ({pkg.duration_days} Hari)
                </ScrollRevealHeading>
              </RevealBlock>

              <div className="mt-8 divide-y divide-brand-border rounded-xl border border-brand-border bg-brand-white shadow-xs">
                {pkg.itinerary.map((dayItem, idx) => (
                  <motion.div
                    key={dayItem.day}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(idx, 5) * 0.05,
                      ease: SMOOTH_EASE,
                    }}
                    className="grid grid-cols-1 gap-2 px-6 py-5 transition-colors hover:bg-brand-surface/70 sm:grid-cols-12 sm:gap-6"
                  >
                    <div className="sm:col-span-2">
                      <span className="font-mono text-xs font-semibold text-brand-teal tabular-nums">
                        Hari {String(dayItem.day).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="sm:col-span-10">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                        {dayItem.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-brand-charcoal/85">
                        {dayItem.summary}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
