import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import { ScrollRevealHeading } from '../components/common/AnimatedText.tsx';
import { SafahIslamicPattern } from '../components/common/IslamicGreenDecoration.tsx';
import { MediaImage } from '../components/common/MediaImage.tsx';
import {
  InteractiveCard,
  ParallaxFrame,
  RevealBlock,
  RevealParagraph,
  SMOOTH_EASE,
} from '../components/common/MotionPrimitives.tsx';
import { PackageCard } from '../components/packages/PackageCard.tsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { fetchPackages } from '../services/packageService.ts';
import type { UmrahPackage } from '../types/travel.ts';
import { buildWhatsAppUrl } from '../utils/whatsapp.ts';

const HERO_IMAGE = `${import.meta.env.BASE_URL}src/assets/images/package_makkah_haram_1795245601010.jpg`;
const CONSULTATION_IMAGE =
  `${import.meta.env.BASE_URL}assets/aistudio/Gemini_Generated_Image_azm31razm31razm3_bd6b0af4.jfif`;

const GALLERY_ITEMS = [
  {
    src: `${import.meta.env.BASE_URL}src/assets/images/hero_masjid_nabawi_1795245600279.jpg`,
    title: 'Pelataran Masjid Nabawi, Madinah',
    caption:
      'Suasana senja yang tenang di pelataran Masjid Nabawi dengan akses jalan kaki dari hotel.',
  },
  {
    src: `${import.meta.env.BASE_URL}src/assets/images/package_madinah_courtyard_1795245601259.jpg`,
    title: 'Koridor Teduh di Tanah Suci',
    caption:
      'Lingkungan yang tertata dan nyaman untuk kekhusyukan ibadah keluarga maupun lansia.',
  },
  {
    src: `${import.meta.env.BASE_URL}src/assets/images/package_luxury_suite_1795245600782.jpg`,
    title: 'Akomodasi Hotel Pilihan',
    caption:
      'Kamar istirahat yang bersih, tenang, dan tertata dengan standar pelayanan premium.',
  },
];

const SERVICE_PILLARS = [
  {
    number: '01',
    title: 'Jarak Hotel Terukur ke Masjid',
    detail:
      'Setiap contoh program memprioritaskan akomodasi di pelataran Masjidil Haram dan Masjid Nabawi agar jamaah dapat beribadah lebih tenang tanpa kelelahan di perjalanan.',
  },
  {
    number: '02',
    title: 'Rincian Biaya & Fasilitas Transparan',
    detail:
      'Setiap paket memisahkan fasilitas yang sudah termasuk dan pengeluaran pribadi secara jelas sejak awal dalam mata uang Rupiah tanpa biaya tersembunyi.',
  },
  {
    number: '03',
    title: 'Ritme Ibadah yang Nyaman',
    detail:
      'Jadwal perjalanan menyeimbangkan agenda ziarah terpandu, kajian Manasik, serta waktu ibadah mandiri yang lapang bagi keluarga dan jamaah lansia.',
  },
  {
    number: '04',
    title: 'Pendampingan Terstruktur Pra-Keberangkatan',
    detail:
      'Mulai dari pemilihan tanggal hingga persiapan Manasik, calon jamaah memperoleh daftar periksa yang tertata dan konsultasi yang mudah diakses.',
  },
];

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Bandingkan Paket',
    description:
      'Tinjau durasi perjalanan, jarak hotel, maskapai, serta rincian fasilitas setiap program.',
  },
  {
    step: '02',
    title: 'Pilih Jadwal Berangkat',
    description:
      'Periksa ketersediaan kuota contoh pada jendela keberangkatan yang paling sesuai.',
  },
  {
    step: '03',
    title: 'Daftar atau Konsultasi',
    description:
      'Kirimkan formulir pendaftaran minat secara daring atau buka konsultasi WhatsApp terisi otomatis.',
  },
  {
    step: '04',
    title: 'Manasik & Persiapan',
    description:
      'Ikuti pembekalan Manasik dan panduan persiapan dokumen sebelum hari keberangkatan.',
  },
];

const FAQS = [
  {
    question: 'Apakah Baitullah Journey merupakan biro perjalanan Umroh berizin resmi?',
    answer:
      'Bukan. Baitullah Journey adalah proyek portofolio pengembangan web untuk mendemonstrasikan arsitektur sistem digital biro Umroh Indonesia. Seluruh paket, tanggal keberangkatan, kuota, dan alamat adalah data simulasi.',
  },
  {
    question:
      'Dokumen apa saja yang diminta pada formulir pendaftaran daring?',
    answer:
      'Formulir hanya meminta data dasar minat seperti nama lengkap, nomor WhatsApp, pilihan paket, tanggal keberangkatan, dan jumlah jamaah. Kami tidak meminta nomor paspor, foto KTP, maupun rekam medis.',
  },
  {
    question: 'Bagaimana cara kerja integrasi konsultasi WhatsApp?',
    answer:
      'Setiap tombol WhatsApp membuka tautan obrolan resmi yang otomatis terisi nama paket dan tanggal keberangkatan pilihan Anda agar konsultasi berlangsung lebih cepat dan terarah.',
  },
  {
    question: 'Apakah jadwal keberangkatan dan kuota terhubung ke basis data?',
    answer:
      'Ya. Daftar paket, jadwal keberangkatan, dan sisa kursi contoh disajikan langsung dari REST API Express dan basis data relasional SQL.',
  },
];

export default function Home() {
  useDocumentMeta(
    'Baitullah Journey – Paket Umroh Pilihan & Jadwal Keberangkatan',
    'Jelajahi pilihan paket Umroh, jarak hotel yang transparan, jadwal keberangkatan, dan formulir pendaftaran minat bersama Baitullah Journey.'
  );

  const [featuredPackages, setFeaturedPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    let active = true;
    async function loadFeatured() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPackages({ limit: 3 });
        if (active) setFeaturedPackages(res.items);
      } catch {
        if (active) setError('Gagal memuat paket unggulan saat ini.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadFeatured();
    return () => {
      active = false;
    };
  }, []);

  return (
    <MainLayout>
      {/* Hero Section: Soft Periwinkle (#9FBCFF) + Deep Teal Islamic Pattern Ornaments + Charcoal Typography */}
      <section className="relative overflow-hidden bg-brand-periwinkle text-brand-charcoal">
        <SafahIslamicPattern variant="section" tone="teal" />

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-24 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-24 lg:pb-28">
          <div className="lg:col-span-6">
            <RevealBlock variant="fadeDown" immediate>
              <p className="text-xs font-semibold tracking-wider text-brand-forest uppercase">
                Baitullah Journey · Luxury Islamic Umrah Platform
              </p>
            </RevealBlock>
            <ScrollRevealHeading
              as="h1"
              className="mt-4 font-['Plus_Jakarta_Sans'] text-[clamp(2.15rem,4vw,3.35rem)] font-bold leading-[1.12] tracking-tight text-brand-charcoal"
            >
              Perjalanan Ibadah Umroh Terencana dengan{' '}
              <span className="text-animated-header-dark">
                Ketenangan dan Kemuliaan
              </span>
            </ScrollRevealHeading>
            <RevealParagraph
              immediate
              delay={0.12}
              className="mt-5 max-w-xl text-base leading-relaxed text-brand-charcoal/90 sm:text-lg"
            >
              Temukan pilihan paket Umroh dengan informasi jarak hotel yang terukur, jadwal keberangkatan terstruktur, serta layanan konsultasi yang tertata bagi calon jamaah Indonesia.
            </RevealParagraph>
            <RevealBlock
              variant="fadeUp"
              delay={0.2}
              immediate
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/packages"
                className="btn-primary-teal inline-flex items-center gap-2 px-6 py-3 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
              >
                <span>Jelajahi Paket Umroh</span>
                <ArrowRight className="h-4 w-4 text-current" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary-outline inline-flex items-center justify-center px-6 py-3 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-forest"
              >
                Hubungi Kami
              </Link>
            </RevealBlock>
          </div>

          <div className="lg:col-span-6">
            <ParallaxFrame
              immediate
              className="aspect-[16/10] rounded-xl border border-brand-forest/20 bg-brand-white shadow-lg"
            >
              <MediaImage
                src={HERO_IMAGE}
                alt="Suasana pelataran Masjidil Haram dan Ka'bah di Makkah pada waktu senja"
                priority
                className="h-full w-full object-cover object-center"
              />
            </ParallaxFrame>
          </div>
        </div>

        <div className="divider-periwinkle-shimmer relative z-10" aria-hidden="true" />
      </section>

      {/* Ringkasan Sorotan (Deep Forest Green Strip) */}
      <section
        aria-label="Sorotan Layanan"
        className="relative overflow-hidden bg-brand-forest-surface text-brand-white"
      >
        <SafahIslamicPattern variant="card" />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 divide-y divide-brand-teal/40 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <RevealBlock variant="fadeUp" delay={0} className="px-4 py-5 sm:px-6">
            <p className="text-xs text-brand-white/75">Program Contoh</p>
            <p className="mt-1 font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-white tabular-nums">
              4 Pilihan Paket Umroh
            </p>
          </RevealBlock>
          <RevealBlock variant="fadeUp" delay={0.07} className="px-4 py-5 sm:px-6">
            <p className="text-xs text-brand-white/75">Akses Masjid</p>
            <p className="mt-1 font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-white tabular-nums">
              120m–200m Area Pelataran
            </p>
          </RevealBlock>
          <RevealBlock variant="fadeUp" delay={0.14} className="px-4 py-5 sm:px-6">
            <p className="text-xs text-brand-white/75">Keberangkatan</p>
            <p className="mt-1 font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-white">
              Rute Jakarta (CGK)
            </p>
          </RevealBlock>
          <RevealBlock variant="fadeUp" delay={0.21} className="px-4 py-5 sm:px-6">
            <p className="text-xs text-brand-white/75">Status Situs</p>
            <p className="mt-1 font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-white">
              Portofolio Demonstrasi
            </p>
          </RevealBlock>
        </div>
        <div className="divider-periwinkle-shimmer relative z-10" aria-hidden="true" />
      </section>

      {/* Tentang Baitullah Journey (Deep Teal #15665F Surface) */}
      <section className="relative overflow-hidden bg-brand-teal text-brand-white">
        <SafahIslamicPattern variant="card" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <RevealBlock variant="slideLeft" className="lg:col-span-6">
              <ParallaxFrame className="aspect-[4/3] rounded-xl border border-brand-white/25 bg-brand-forest-surface shadow-md transition-[border-color,box-shadow] duration-300 hover:border-brand-white/60 hover:shadow-xl lg:aspect-auto lg:h-full">
                <MediaImage
                  src={CONSULTATION_IMAGE}
                  alt="Pembimbing ibadah Umroh mendampingi jamaah di pelataran Masjidil Haram menghadap Ka'bah"
                  className="h-full w-full object-cover"
                />
              </ParallaxFrame>
            </RevealBlock>

            <RevealBlock variant="slideRight" delay={0.08} className="flex flex-col justify-center lg:col-span-6">
              <p className="text-breath-periwinkle text-xs font-semibold tracking-wide uppercase">
                Tentang Baitullah Journey
              </p>
              <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-white">
                Standar baru penyajian informasi Umroh yang{' '}
                <span className="text-animated-periwinkle-dark">
                  jujur dan tertata
                </span>
              </ScrollRevealHeading>
              <RevealParagraph delay={0.1} className="mt-4 text-base leading-relaxed text-brand-white/95">
                Baitullah Journey dirancang sebagai platform demonstrasi digital bagi penyelenggara Umroh modern di Indonesia. Calon jamaah dapat mengevaluasi rincian perjalanan dengan tenang tanpa informasi yang membingungkan.
              </RevealParagraph>
              <RevealParagraph delay={0.18} className="mt-3 text-base leading-relaxed text-brand-white/85">
                Setiap paket menyajikan jarak perkiraan hotel, maskapai penerbangan, jadwal keberangkatan aktual dari basis data, hingga itinerary harian secara transparan.
              </RevealParagraph>
              <div className="mt-7 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="underline-animated-periwinkle group inline-flex items-center gap-2 pb-1 text-sm font-semibold text-brand-white transition-colors hover:text-brand-white/90"
                >
                  <span>Selengkapnya tentang Profil &amp; Legalitas</span>
                  <ArrowRight className="h-4 w-4 text-current transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </RevealBlock>
          </div>
        </div>
        <div className="divider-periwinkle-shimmer relative z-10" aria-hidden="true" />
      </section>

      {/* Paket Umroh Unggulan (Pure White Surface + Pure White Cards) */}
      <section className="border-y border-brand-border bg-brand-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <RevealBlock variant="slideLeft">
              <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
                Pilihan Program Contoh
              </p>
              <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-forest">
                Paket Umroh{' '}
                <span className="text-animated-periwinkle-light">Unggulan</span>
              </ScrollRevealHeading>
            </RevealBlock>
            <RevealBlock variant="slideRight">
              <Link
                to="/packages"
                className="underline-animated-periwinkle group inline-flex items-center gap-1.5 pb-1 text-sm font-semibold text-brand-teal whitespace-nowrap transition-colors hover:text-brand-forest"
              >
                <span>Lihat Semua Paket</span>
                <ArrowRight className="h-4 w-4 text-current transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </RevealBlock>
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-96 animate-pulse rounded-xl border border-brand-border bg-brand-surface p-6"
                />
              ))}
            </div>
          ) : error ? (
            <RevealBlock variant="scaleIn" className="mt-10 rounded-xl border border-brand-border bg-brand-white p-8 text-center">
              <p className="text-sm text-[#7A271E]">{error}</p>
              <Link
                to="/packages"
                className="btn-primary-teal mt-4 inline-flex items-center px-4 py-2 text-xs"
              >
                Buka Katalog Paket
              </Link>
            </RevealBlock>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {featuredPackages.map((pkg, idx) => (
                <PackageCard key={pkg.id} pkg={pkg} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mengapa Memilih Kami (Pure White Surface + Pure White Cards) */}
      <section className="bg-brand-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <RevealBlock variant="fadeDown">
              <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
                Mengapa Memilih Kami
              </p>
            </RevealBlock>
            <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-forest">
              Keunggulan layanan yang berfokus pada{' '}
              <span className="text-animated-periwinkle-light">
                ketenangan ibadah
              </span>
            </ScrollRevealHeading>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {SERVICE_PILLARS.map((item, idx) => (
              <InteractiveCard
                key={item.number}
                index={idx}
                variant={idx % 2 === 0 ? 'slideLeft' : 'slideRight'}
                className="rounded-xl border border-brand-border bg-brand-white p-8 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
              >
                <span className="inline-block font-mono text-xs font-semibold text-brand-teal tabular-nums transition-transform duration-300 group-hover:translate-x-1">
                  {item.number}
                </span>
                <h3 className="mt-2 font-['Plus_Jakarta_Sans'] text-lg font-semibold text-brand-forest transition-colors group-hover:text-brand-teal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/85">
                  {item.detail}
                </p>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Perjalanan Umroh (Alternated Deep Forest Green Section) */}
      <section className="relative overflow-hidden bg-brand-forest py-20 text-brand-white">
        <div className="divider-periwinkle-shimmer absolute top-0 right-0 left-0" aria-hidden="true" />
        <SafahIslamicPattern variant="section" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <RevealBlock variant="fadeDown">
              <p className="text-breath-periwinkle text-xs font-semibold tracking-wide uppercase">
                Proses Pendaftaran
              </p>
            </RevealBlock>
            <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-white">
              Empat langkah sederhana menuju{' '}
              <span className="text-animated-periwinkle-dark">
                kesiapan keberangkatan
              </span>
            </ScrollRevealHeading>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY_STEPS.map((step, idx) => (
              <InteractiveCard
                key={step.step}
                index={idx}
                variant="scaleIn"
                className="rounded-xl border border-brand-teal/65 bg-brand-forest-surface/90 p-6 transition-[border-color,box-shadow] duration-300 hover:border-brand-periwinkle/65 hover:shadow-lg"
              >
                <div className="border-b border-brand-teal/55 pb-3">
                  <span className="inline-block font-mono text-xs font-semibold text-brand-white/90 tabular-nums transition-transform duration-300 group-hover:translate-x-1">
                    Langkah {step.step}
                  </span>
                </div>
                <h3 className="mt-4 font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-white/85">
                  {step.description}
                </p>
              </InteractiveCard>
            ))}
          </div>
        </div>
        <div className="divider-periwinkle-shimmer absolute right-0 bottom-0 left-0" aria-hidden="true" />
      </section>

      {/* Galeri Foto Perjalanan & Akomodasi (Soft Periwinkle #9FBCFF Surface + Islamic Ornament Pattern) */}
      <section className="relative overflow-hidden bg-brand-periwinkle py-20 text-brand-charcoal">
        <SafahIslamicPattern variant="section" tone="forest" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <RevealBlock variant="fadeDown">
              <p className="text-xs font-semibold tracking-wide text-brand-forest uppercase">
                Galeri Foto
              </p>
            </RevealBlock>
            <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-charcoal">
              Suasana Tanah Suci &amp;{' '}
              <span className="text-animated-header-dark">
                standar akomodasi
              </span>
            </ScrollRevealHeading>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {GALLERY_ITEMS.map((photo, idx) => (
              <InteractiveCard
                key={photo.title}
                index={idx}
                variant="fadeUp"
                className="overflow-hidden rounded-xl border border-brand-forest/15 bg-brand-white shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-forest/45 hover:shadow-xl"
              >
                <ParallaxFrame className="aspect-[4/3] bg-brand-surface">
                  <MediaImage
                    src={photo.src}
                    alt={photo.title}
                    className="h-full w-full object-cover"
                  />
                </ParallaxFrame>
                <div className="p-5">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest transition-colors group-hover:text-brand-teal">
                    {photo.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-charcoal/85">
                    {photo.caption}
                  </p>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pertanyaan Umum / FAQ (Pure White Surface) */}
      <section className="border-t border-brand-border bg-brand-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RevealBlock variant="fadeDown">
              <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
                Pertanyaan Umum
              </p>
            </RevealBlock>
            <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-forest">
              Informasi seputar{' '}
              <span className="text-animated-periwinkle-light">
                platform &amp; paket contoh
              </span>
            </ScrollRevealHeading>
          </div>

          <RevealBlock variant="scaleIn" delay={0.08} className="mt-10 divide-y divide-brand-border rounded-xl border border-brand-border bg-brand-white shadow-xs">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-brand-surface active:bg-brand-surface/80 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-teal"
                  >
                    <span className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-brand-teal transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="faq-body"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: SMOOTH_EASE }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-sm leading-relaxed text-brand-charcoal/85">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </RevealBlock>
        </div>
      </section>

      {/* Call-to-Action Konsultasi WhatsApp (Deep Forest Green Section) */}
      <section className="relative overflow-hidden bg-brand-forest py-16 text-brand-white">
        <div className="divider-periwinkle-shimmer absolute top-0 right-0 left-0" aria-hidden="true" />
        <SafahIslamicPattern variant="section" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <RevealBlock variant="slideLeft" className="max-w-2xl">
            <p className="text-breath-periwinkle text-xs font-semibold tracking-wide uppercase">
              Konsultasi &amp; Pendaftaran Minat
            </p>
            <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-brand-white sm:text-3xl">
              Ingin berdiskusi mengenai jadwal keberangkatan atau{' '}
              <span className="text-animated-periwinkle-dark">
                pilihan kamar keluarga?
              </span>
            </ScrollRevealHeading>
            <RevealParagraph delay={0.1} className="mt-2 text-sm leading-relaxed text-brand-white/85 sm:text-base">
              Mulai konsultasi melalui WhatsApp dengan pesan terisi otomatis atau kirimkan pendaftaran minat Anda secara daring.
            </RevealParagraph>
          </RevealBlock>
          <RevealBlock variant="slideRight" delay={0.12} className="flex shrink-0 flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="btn-primary-teal inline-flex items-center justify-center px-5 py-3 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              Daftar Sekarang
            </Link>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-outline inline-flex items-center gap-2 px-5 py-3 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              <MessageCircle
                className="h-4 w-4 text-current"
                aria-hidden="true"
              />
              <span>Konsultasi WhatsApp</span>
            </a>
          </RevealBlock>
        </div>
      </section>
    </MainLayout>
  );
}
