import { Link } from 'react-router-dom';
import { RevealBlock } from '../common/MotionPrimitives.tsx';
import { SafahIslamicPattern } from '../common/IslamicGreenDecoration.tsx';
import { SafahLogo } from '../common/SafahLogo.tsx';
import { CONTACT_EMAIL, OFFICE_ADDRESS } from '../../utils/contactConfig.ts';
import { buildWhatsAppUrl } from '../../utils/whatsapp.ts';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-charcoal text-brand-white">
      <div className="divider-periwinkle-shimmer" aria-hidden="true" />
      <SafahIslamicPattern variant="section" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <RevealBlock variant="fadeUp" delay={0} className="space-y-4 md:col-span-5">
            <Link to="/" className="inline-flex items-center transition-transform duration-200 hover:scale-[1.02]">
              <SafahLogo size="md" />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-brand-white/90">
              Platform portofolio demonstrasi untuk perjalanan ibadah Umroh dengan standar penyajian informasi yang jernih, elegan, dan terstruktur.
            </p>
            <p className="text-xs leading-relaxed text-brand-white/75">
              Pemberitahuan Portofolio: Seluruh paket, jadwal, alamat kantor, dan profil adalah data contoh simulasi. Baitullah Journey tidak mengklaim izin PPIU resmi.
            </p>
          </RevealBlock>

          <RevealBlock variant="fadeUp" delay={0.08} className="space-y-3 md:col-span-3">
            <h2 className="text-sm font-semibold text-brand-white">Navigasi</h2>
            <ul className="space-y-2 text-sm text-brand-white/90">
              <li>
                <Link to="/" className="underline-animated-periwinkle transition-colors hover:text-brand-periwinkle">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/packages" className="underline-animated-periwinkle transition-colors hover:text-brand-periwinkle">
                  Paket Umroh
                </Link>
              </li>
              <li>
                <Link to="/about" className="underline-animated-periwinkle transition-colors hover:text-brand-periwinkle">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/register" className="underline-animated-periwinkle transition-colors hover:text-brand-periwinkle">
                  Pendaftaran Minat
                </Link>
              </li>
              <li>
                <Link to="/contact" className="underline-animated-periwinkle transition-colors hover:text-brand-periwinkle">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </RevealBlock>

          <RevealBlock variant="fadeUp" delay={0.16} className="space-y-3 md:col-span-4">
            <h2 className="text-sm font-semibold text-brand-white">
              Kontak &amp; Media Sosial
            </h2>
            <div className="space-y-2 text-sm text-brand-white/90">
              <p>{OFFICE_ADDRESS}</p>
              <p>{CONTACT_EMAIL}</p>
              <p className="text-xs text-brand-white/75">
                Instagram: @baitullah.journey.demo · YouTube: Baitullah Journey
              </p>
              <p className="pt-1">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-animated-periwinkle font-medium text-brand-white transition-colors hover:text-brand-periwinkle"
                >
                  Konsultasi via WhatsApp
                </a>
              </p>
            </div>
          </RevealBlock>
        </div>

        <RevealBlock
          variant="fadeUp"
          delay={0.2}
          className="mt-12 flex flex-col gap-3 border-t border-brand-teal/55 pt-6 text-xs text-brand-white/80 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {year} Baitullah Journey Portofolio Demonstrasi. Konten ilustrasi.</p>
          <p className="text-brand-white/80">Baitullah Journey · Platform Portofolio Umroh</p>
        </RevealBlock>
      </div>
    </footer>
  );
}
