import { Link } from 'react-router-dom';
import { ScrollRevealHeading } from '../components/common/AnimatedText.tsx';
import { RevealBlock, RevealParagraph } from '../components/common/MotionPrimitives.tsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts';
import { MainLayout } from '../layouts/MainLayout.tsx';

export default function NotFound() {
  useDocumentMeta(
    'Halaman Tidak Ditemukan – Baitullah Journey',
    'Halaman yang Anda cari tidak ditemukan.'
  );

  return (
    <MainLayout>
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <RevealBlock variant="scaleIn" immediate>
          <p className="font-mono text-sm font-semibold text-brand-teal">404</p>
          <ScrollRevealHeading
            as="h1"
            className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-forest sm:text-4xl"
          >
            Halaman{' '}
            <span className="text-animated-periwinkle-light">tidak ditemukan</span>
          </ScrollRevealHeading>
          <RevealParagraph immediate delay={0.08} className="mt-3 text-base text-brand-charcoal/85">
            Maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
          </RevealParagraph>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn-primary-teal px-5 py-2.5 text-sm">
              Kembali ke Beranda
            </Link>
            <Link to="/packages" className="btn-secondary-outline px-5 py-2.5 text-sm">
              Lihat Paket Umroh
            </Link>
          </div>
        </RevealBlock>
      </section>
    </MainLayout>
  );
}
