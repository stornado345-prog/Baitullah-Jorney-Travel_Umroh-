import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { ScrollRevealHeading } from '../components/common/AnimatedText.tsx';
import { SafahIslamicPattern } from '../components/common/IslamicGreenDecoration.tsx';
import { MediaImage } from '../components/common/MediaImage.tsx';
import {
  InteractiveCard,
  ParallaxFrame,
  RevealBlock,
  RevealParagraph,
} from '../components/common/MotionPrimitives.tsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts';
import { MainLayout } from '../layouts/MainLayout.tsx';

const ABOUT_IMAGE =
  '/assets/aistudio/Gemini_Generated_Image_azm31razm31razm3_bd6b0af4.jfif';

const SAMPLE_TEAM = [
  {
    name: 'Ustadz Farhan Al-Mansoor',
    role: 'Pembimbing Manasik & Ibadah (Profil Contoh)',
    bio: 'Profil ilustrasi yang merepresentasikan peran pembimbing syariah untuk sesi Manasik pra-keberangkatan dan pendampingan ibadah di Tanah Suci.',
  },
  {
    name: 'Siti Rahmawati, S.E.',
    role: 'Koordinator Operasional & Jamaah (Profil Contoh)',
    bio: 'Profil ilustrasi yang merepresentasikan pengelolaan jadwal keberangkatan, akomodasi hotel, dan kenyamanan rombongan keluarga.',
  },
  {
    name: 'Bagus Prakoso',
    role: 'Layanan Digital & Konsultasi (Profil Contoh)',
    bio: 'Profil ilustrasi yang merepresentasikan transparansi informasi paket digital serta respon cepat layanan WhatsApp.',
  },
];

const VISION_ITEMS = [
  {
    num: '01',
    title: 'Visi',
    desc: 'Menghadirkan standar informasi perjalanan Umroh digital yang jernih dan amanah—memastikan setiap hotel, jadwal, dan batasan biaya tersaji terbuka sebelum mendaftar.',
  },
  {
    num: '02',
    title: 'Misi',
    desc: 'Menyediakan perbandingan paket yang mudah dipahami, formulir pendaftaran yang ramah perangkat seluler, serta arsitektur backend yang siap dikembangkan lebih lanjut.',
  },
  {
    num: '03',
    title: 'Filosofi Layanan',
    desc: 'Ibadah memerlukan ketenangan hati. Setiap rencana perjalanan contoh disusun dengan jeda istirahat yang cukup dan akses dekat ke Masjidil Haram serta Masjid Nabawi.',
  },
];

export default function About() {
  useDocumentMeta(
    'Tentang Kami – Baitullah Journey',
    'Mengenal profil Baitullah Journey, visi dan misi, nilai pelayanan, contoh profil tim, serta pemberitahuan legalitas portofolio.'
  );

  return (
    <MainLayout>
      {/* Pengenalan Profil (Deep Forest Green) */}
      <section className="relative overflow-hidden bg-brand-forest py-16 text-brand-white">
        <SafahIslamicPattern variant="card" />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <RevealBlock variant="slideLeft" immediate className="flex flex-col justify-center lg:col-span-6">
            <p className="text-breath-periwinkle text-xs font-semibold tracking-wide uppercase">
              Tentang Kami · Portofolio Demonstrasi
            </p>
            <ScrollRevealHeading
              as="h1"
              className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-white sm:text-4xl"
            >
              Dirancang dengan kejelasan, keteduhan, dan{' '}
              <span className="text-animated-periwinkle-dark">
                standar pelayanan Islami
              </span>
            </ScrollRevealHeading>
            <RevealParagraph immediate delay={0.1} className="mt-4 text-base leading-relaxed text-brand-white/85">
              Baitullah Journey merupakan proyek demonstrasi rekayasa web full-stack untuk biro perjalanan Umroh Indonesia. Platform ini memperlihatkan bagaimana calon jamaah dapat meninjau jarak hotel, membandingkan jadwal, dan mengirimkan pendaftaran minat secara nyaman.
            </RevealParagraph>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/packages"
                className="btn-primary-teal inline-flex items-center px-5 py-2.5 text-sm"
              >
                Lihat Paket Umroh
              </Link>
              <Link
                to="/contact"
                className="btn-hero-outline inline-flex items-center px-5 py-2.5 text-sm"
              >
                Informasi Kantor Demo
              </Link>
            </div>
          </RevealBlock>

          <RevealBlock variant="slideRight" immediate delay={0.1} className="lg:col-span-6">
            <ParallaxFrame
              immediate
              className="aspect-[4/3] rounded-xl border border-brand-teal/65 bg-brand-forest-surface shadow-xs lg:h-full"
            >
              <MediaImage
                src={ABOUT_IMAGE}
                alt="Pembimbing ibadah Umroh bersama jamaah di pelataran Masjidil Haram"
                priority
                className="h-full w-full object-cover"
              />
            </ParallaxFrame>
          </RevealBlock>
        </div>
        <div className="divider-periwinkle-shimmer absolute right-0 bottom-0 left-0" aria-hidden="true" />
      </section>

      {/* Visi, Misi, Nilai Layanan (Pure White) */}
      <section className="bg-brand-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {VISION_ITEMS.map((item, idx) => (
              <InteractiveCard
                key={item.num}
                index={idx}
                variant="fadeUp"
                className="rounded-xl border border-brand-border bg-brand-white p-7 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
              >
                <span className="inline-block font-mono text-xs font-semibold text-brand-teal transition-transform duration-300 group-hover:translate-x-1">
                  {item.num}
                </span>
                <h2 className="mt-2 font-['Plus_Jakarta_Sans'] text-lg font-semibold text-brand-forest">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/85">
                  {item.desc}
                </p>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Profil Tim Contoh (Pure White) */}
      <section className="border-y border-brand-border bg-brand-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RevealBlock variant="fadeDown">
            <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
              Layanan Kami &amp; Tim Pembimbing
            </p>
          </RevealBlock>
          <ScrollRevealHeading className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold text-brand-forest sm:text-3xl">
            Contoh Profil{' '}
            <span className="text-animated-periwinkle-light">
              Tim Operasional
            </span>
          </ScrollRevealHeading>
          <RevealParagraph delay={0.08} className="mt-2 text-sm text-brand-charcoal/80">
            Seluruh profil di bawah ini bersifat fiktif untuk menggambarkan struktur tim pembimbing dan operasional pada situs biro Umroh.
          </RevealParagraph>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {SAMPLE_TEAM.map((member, idx) => (
              <InteractiveCard
                key={member.name}
                index={idx}
                variant="scaleIn"
                className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
              >
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest transition-colors group-hover:text-brand-teal">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-brand-teal">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/85">
                  {member.bio}
                </p>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pemberitahuan Legalitas (Deep Forest Green Card) */}
      <section className="bg-brand-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <InteractiveCard
            variant="blurReveal"
            className="relative overflow-hidden rounded-xl border border-brand-teal bg-brand-forest p-8 text-brand-white shadow-xs transition-[border-color,box-shadow] duration-300 hover:shadow-lg"
          >
            <SafahIslamicPattern variant="card" />
            <div className="relative z-10 flex items-start gap-4">
              <ShieldAlert
                className="mt-0.5 h-6 w-6 shrink-0 text-white transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-brand-white">
                  <span className="text-animated-periwinkle-dark">
                    Informasi Legalitas
                  </span>{' '}
                  (Placeholder Portofolio)
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-white/90">
                  Baitullah Journey adalah proyek portofolio pengembangan perangkat lunak semata. Situs ini tidak menyelenggarakan pemberangkatan Umroh komersial, tidak menerima pembayaran, dan tidak memiliki izin resmi PPIU dari Kementerian Agama Republik Indonesia.
                </p>
                <p className="mt-3 text-xs text-brand-white/75">
                  Placeholder Izin PPIU: [Nomor Izin PPIU Placeholder — Hanya Diisi Apabila Digunakan oleh Biro Berizin Resmi]
                </p>
              </div>
            </div>
          </InteractiveCard>
        </div>
      </section>
    </MainLayout>
  );
}
