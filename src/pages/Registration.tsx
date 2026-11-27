import { useSearchParams } from 'react-router-dom';
import { ScrollRevealHeading } from '../components/common/AnimatedText.tsx';
import { SafahIslamicPattern } from '../components/common/IslamicGreenDecoration.tsx';
import {
  InteractiveCard,
  RevealBlock,
  RevealParagraph,
} from '../components/common/MotionPrimitives.tsx';
import { RegistrationForm } from '../components/forms/RegistrationForm.tsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts';
import { MainLayout } from '../layouts/MainLayout.tsx';

export default function Registration() {
  useDocumentMeta(
    'Pendaftaran Umroh – Baitullah Journey',
    'Kirimkan formulir pendaftaran minat Umroh contoh dengan validasi langsung dan tindak lanjut melalui WhatsApp.'
  );

  const [searchParams] = useSearchParams();
  const initialPackageId = Number(searchParams.get('packageId')) || undefined;
  const initialDepartureId =
    Number(searchParams.get('departureId')) || undefined;

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-brand-forest py-12 text-brand-white">
        <SafahIslamicPattern variant="card" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RevealBlock variant="fadeDown" immediate>
            <p className="text-breath-periwinkle text-xs font-semibold tracking-wide uppercase">
              Formulir Minat Daring · Demonstrasi
            </p>
          </RevealBlock>
          <ScrollRevealHeading
            as="h1"
            className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-white sm:text-4xl"
          >
            Pendaftaran{' '}
            <span className="text-animated-periwinkle-dark">Minat Umroh</span>
          </ScrollRevealHeading>
          <RevealParagraph
            immediate
            delay={0.1}
            className="mt-3 max-w-2xl text-base leading-relaxed text-brand-white/85"
          >
            Daftarkan minat Anda pada salah satu paket dan jadwal keberangkatan contoh. Data divalidasi di klien serta server dan disimpan ke basis data simulasi.
          </RevealParagraph>
        </div>
        <div className="divider-periwinkle-shimmer absolute right-0 bottom-0 left-0" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RegistrationForm
              initialPackageId={initialPackageId}
              initialDepartureId={initialDepartureId}
            />
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <InteractiveCard
              index={0}
              variant="slideRight"
              className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
            >
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                Alur Setelah Pengiriman
              </h2>
              <ol className="mt-4 space-y-4 text-sm text-brand-charcoal/85">
                <li className="flex gap-3">
                  <span className="mt-0.5 font-mono text-xs font-semibold text-brand-teal">
                    01
                  </span>
                  <span>
                    Pengajuan Anda memperoleh nomor referensi unik dan memperbarui sisa kursi contoh pada jadwal terpilih.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 font-mono text-xs font-semibold text-brand-teal">
                    02
                  </span>
                  <span>
                    Pengiriman ganda dengan nomor WhatsApp dan jadwal keberangkatan yang sama akan dicegah secara otomatis.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 font-mono text-xs font-semibold text-brand-teal">
                    03
                  </span>
                  <span>
                    Anda dapat langsung melanjutkan konsultasi melalui WhatsApp dengan ringkasan paket terisi otomatis.
                  </span>
                </li>
              </ol>
            </InteractiveCard>

            <InteractiveCard
              index={1}
              variant="slideRight"
              className="relative overflow-hidden rounded-xl border border-brand-teal bg-brand-forest p-6 text-xs leading-relaxed text-brand-white/90 shadow-xs transition-[border-color,box-shadow] duration-300 hover:shadow-lg"
            >
              <SafahIslamicPattern variant="card" />
              <div className="relative z-10">
                <p className="font-semibold text-brand-white">
                  Standar Minimalisasi Data
                </p>
                <p className="mt-2">
                  Sesuai prinsip keamanan portofolio, formulir ini tidak meminta nomor paspor, unggahan KTP, maupun data kesehatan pribadi.
                </p>
              </div>
            </InteractiveCard>
          </aside>
        </div>
      </section>
    </MainLayout>
  );
}
