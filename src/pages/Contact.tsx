import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { ScrollRevealHeading } from '../components/common/AnimatedText.tsx';
import { SafahIslamicPattern } from '../components/common/IslamicGreenDecoration.tsx';
import {
  InteractiveCard,
  RevealBlock,
  RevealParagraph,
  SMOOTH_EASE,
} from '../components/common/MotionPrimitives.tsx';
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { CONTACT_EMAIL, OFFICE_ADDRESS } from '../utils/contactConfig.ts';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '../utils/whatsapp.ts';

const contactMessageSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal terdiri dari 3 karakter.')
    .max(120, 'Nama lengkap maksimal 120 karakter.'),
  senderContact: z
    .string()
    .trim()
    .min(5, 'Masukkan alamat email atau nomor WhatsApp yang dapat dihubungi.')
    .max(160),
  subject: z
    .string()
    .trim()
    .min(3, 'Subjek pesan minimal 3 karakter.')
    .max(160, 'Subjek maksimal 160 karakter.'),
  messageBody: z
    .string()
    .trim()
    .min(10, 'Pesan minimal terdiri dari 10 karakter.')
    .max(1000, 'Pesan tidak boleh melebihi 1000 karakter.'),
});

type ContactMessageValues = z.infer<typeof contactMessageSchema>;

export default function Contact() {
  useDocumentMeta(
    'Hubungi Kami – Baitullah Journey',
    'Informasi kontak demonstrasi Baitullah Journey, formulir pesan, layanan konsultasi WhatsApp, alamat kantor contoh, dan peta lokasi.'
  );

  const [sentInquiry, setSentInquiry] = useState<ContactMessageValues | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      senderName: '',
      senderContact: '',
      subject: '',
      messageBody: '',
    },
  });

  const onSubmitMessage = (values: ContactMessageValues) => {
    setSentInquiry(values);
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-brand-forest py-12 text-brand-white">
        <SafahIslamicPattern variant="card" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RevealBlock variant="fadeDown" immediate>
            <p className="text-breath-periwinkle text-xs font-semibold tracking-wide uppercase">
              Informasi Kontak Demonstrasi
            </p>
          </RevealBlock>
          <ScrollRevealHeading
            as="h1"
            className="mt-2 font-['Plus_Jakarta_Sans'] text-3xl font-bold tracking-tight text-brand-white sm:text-4xl"
          >
            Hubungi{' '}
            <span className="text-animated-periwinkle-dark">Baitullah Journey</span>
          </ScrollRevealHeading>
          <RevealParagraph
            immediate
            delay={0.1}
            className="mt-3 max-w-2xl text-base leading-relaxed text-brand-white/85"
          >
            Seluruh nomor kontak, alamat email, dan alamat kantor di bawah ini merupakan data contoh untuk keperluan demonstrasi portofolio.
          </RevealParagraph>
        </div>
        <div className="divider-periwinkle-shimmer absolute right-0 bottom-0 left-0" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Kolom Kiri: Kartu Informasi Kontak */}
          <div className="space-y-6 lg:col-span-5">
            <InteractiveCard
              index={0}
              variant="slideLeft"
              className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <MessageCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                    Konsultasi WhatsApp (Nomor Contoh)
                  </h2>
                  <p className="mt-1 text-sm text-brand-text-secondary tabular-nums">
                    +{WHATSAPP_NUMBER} (Placeholder Demo)
                  </p>
                  <a
                    href={buildWhatsAppUrl({
                      customNote:
                        'Pertanyaan umum melalui halaman Hubungi Kami',
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary-teal mt-3 inline-flex items-center gap-2 px-4 py-2 text-xs"
                  >
                    <span>Mulai Obrolan WhatsApp</span>
                    <ExternalLink
                      className="h-3.5 w-3.5 text-current"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </div>
            </InteractiveCard>

            <InteractiveCard
              index={1}
              variant="slideLeft"
              className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                    Alamat Email Contoh
                  </h2>
                  <p className="mt-1 text-sm font-medium text-brand-charcoal">
                    {CONTACT_EMAIL}
                  </p>
                  <p className="mt-1 text-xs text-brand-text-secondary">
                    Email simulasi portofolio · Tidak melayani transaksi komersial
                  </p>
                </div>
              </div>
            </InteractiveCard>

            <InteractiveCard
              index={2}
              variant="slideLeft"
              className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                    Alamat Kantor Contoh
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-brand-charcoal/85">
                    {OFFICE_ADDRESS}
                  </p>
                  <p className="mt-2 text-xs text-brand-text-secondary">
                    Jam Konsultasi Contoh: Senin – Sabtu, 09.00 – 17.00 WIB
                  </p>
                </div>
              </div>
            </InteractiveCard>

            <InteractiveCard
              index={3}
              variant="slideLeft"
              className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
            >
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                Media Sosial Contoh
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-brand-charcoal">
                <span>Instagram: @baitullah.journey.demo</span>
                <span aria-hidden="true" className="text-brand-teal">
                  ·
                </span>
                <span>YouTube: Baitullah Journey Portofolio</span>
              </div>
            </InteractiveCard>
          </div>

          {/* Kolom Kanan: Formulir Pesan + Google Maps Placeholder */}
          <div className="space-y-8 lg:col-span-7">
            <RevealBlock
              variant="slideRight"
              className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-md sm:p-8"
            >
              <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
                Formulir Pesan · Demonstrasi
              </p>
              <ScrollRevealHeading className="mt-1 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-brand-forest">
                Kirim Pertanyaan kepada{' '}
                <span className="text-animated-periwinkle-light">
                  Tim Konsultan
                </span>
              </ScrollRevealHeading>
              <p className="mt-1 text-sm text-brand-charcoal/80">
                Gunakan formulir pesan ini untuk menyusun pertanyaan seputar paket atau lanjutkan langsung ke obrolan WhatsApp.
              </p>

              <AnimatePresence mode="wait">
                {sentInquiry ? (
                  <motion.div
                    key="sent-card"
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -8 }}
                    transition={{ duration: 0.35, ease: SMOOTH_EASE }}
                    className="mt-6 rounded-lg border border-brand-teal bg-brand-surface p-6"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-brand-teal"
                        aria-hidden="true"
                      />
                      <div className="space-y-2">
                        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-brand-forest">
                          Pesan Siap Diteruskan (Simulasi)
                        </h3>
                        <p className="text-sm text-brand-charcoal/90">
                          Terima kasih,{' '}
                          <span className="font-semibold text-brand-charcoal">
                            {sentInquiry.senderName}
                          </span>
                          . Pesan mengenai{' '}
                          <span className="font-semibold text-brand-charcoal">
                            “{sentInquiry.subject}”
                          </span>{' '}
                          telah divalidasi. Anda dapat meneruskan pesan ini langsung ke WhatsApp resmi demo.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <a
                            href={buildWhatsAppUrl({
                              visitorName: sentInquiry.senderName,
                              customNote: `${sentInquiry.subject} — ${sentInquiry.messageBody}`,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary-teal inline-flex items-center gap-2 px-4 py-2 text-xs"
                          >
                            <MessageCircle
                              className="h-3.5 w-3.5 text-current"
                              aria-hidden="true"
                            />
                            <span>Teruskan ke WhatsApp</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setSentInquiry(null);
                              reset();
                            }}
                            className="btn-secondary-outline px-4 py-2 text-xs"
                          >
                            Tulis Pesan Lain
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit(onSubmitMessage)}
                    noValidate
                    className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                  <div>
                    <label
                      htmlFor="senderName"
                      className="block text-xs font-semibold text-brand-charcoal"
                    >
                      Nama Lengkap <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <input
                      id="senderName"
                      type="text"
                      placeholder="Nama Anda"
                      {...register('senderName')}
                      className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-3.5 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
                    />
                    {errors.senderName && (
                      <p className="mt-1 text-xs text-[#9E2A2B]">
                        {errors.senderName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="senderContact"
                      className="block text-xs font-semibold text-brand-charcoal"
                    >
                      Email atau WhatsApp <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <input
                      id="senderContact"
                      type="text"
                      placeholder="contoh@domain.id atau 0812..."
                      {...register('senderContact')}
                      className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-3.5 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
                    />
                    {errors.senderContact && (
                      <p className="mt-1 text-xs text-[#9E2A2B]">
                        {errors.senderContact.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="subject"
                      className="block text-xs font-semibold text-brand-charcoal"
                    >
                      Subjek Pesan <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Contoh: Konsultasi kamar Double untuk keberangkatan Februari"
                      {...register('subject')}
                      className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-3.5 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-[#9E2A2B]">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="messageBody"
                      className="block text-xs font-semibold text-brand-charcoal"
                    >
                      Isi Pesan <span className="text-[#9E2A2B]">*</span>
                    </label>
                    <textarea
                      id="messageBody"
                      rows={3}
                      placeholder="Tuliskan pertanyaan atau kebutuhan rencana perjalanan Anda..."
                      {...register('messageBody')}
                      className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-3.5 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
                    />
                    {errors.messageBody && (
                      <p className="mt-1 text-xs text-[#9E2A2B]">
                        {errors.messageBody.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-1 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-teal inline-flex items-center gap-2 px-5 py-2.5 text-sm"
                    >
                      <Send
                        className="h-4 w-4 text-current"
                        aria-hidden="true"
                      />
                      <span>Kirim Pesan</span>
                    </button>
                  </div>
                </motion.form>
              )}
              </AnimatePresence>
            </RevealBlock>

            {/* Placeholder Google Maps */}
            <InteractiveCard
              index={1}
              variant="fadeUp"
              className="flex flex-col justify-between rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg sm:p-8"
            >
              <div>
                <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
                  Placeholder Google Maps · Jakarta Selatan
                </p>
                <h2 className="mt-2 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-brand-forest">
                  Pratinjau Lokasi Kantor Contoh
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-brand-charcoal/85">
                  Pada penerapan biro perjalanan resmi, area ini menampilkan peta interaktif lokasi kantor terverifikasi. Untuk versi portofolio demonstrasi ini, tidak ada klaim alamat usaha nyata.
                </p>
              </div>

              <div className="my-6 flex items-center justify-center rounded-lg border border-dashed border-brand-teal/45 bg-brand-surface p-6 text-center">
                <div className="max-w-sm space-y-2">
                  <MapPin
                    className="mx-auto h-7 w-7 text-brand-teal"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-brand-forest">
                    Kebayoran Baru, Jakarta Selatan (Titik Simulasi)
                  </p>
                  <p className="text-xs text-brand-text-secondary tabular-nums">
                    Koordinat: -6.2435° LS, 106.7985° BT (Ilustrasi)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-border pt-5">
                <span className="text-xs text-brand-text-secondary">
                  Tautan peta membuka area Kebayoran Baru di Google Maps
                </span>
                <a
                  href="https://maps.google.com/?q=Kebayoran+Baru+Jakarta+Selatan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-teal inline-flex items-center gap-2 px-4 py-2 text-xs"
                >
                  <span>Buka Area di Google Maps</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 text-current"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </InteractiveCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
