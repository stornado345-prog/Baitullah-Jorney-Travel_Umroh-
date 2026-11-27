import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { SMOOTH_EASE } from '../common/MotionPrimitives.tsx';
import type {
  Departure,
  RegistrationResponseData,
  UmrahPackage,
} from '../../types/travel.ts';
import { extractApiErrorMessage } from '../../services/api.ts';
import {
  fetchPackageDepartures,
  fetchPackages,
} from '../../services/packageService.ts';
import { submitRegistration } from '../../services/registrationService.ts';
import {
  formatDateLong,
  formatDepartureStatusLabel,
  formatIDR,
} from '../../utils/formatters.ts';
import { buildWhatsAppUrl } from '../../utils/whatsapp.ts';

const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Nama lengkap minimal terdiri dari 3 karakter.')
    .max(150, 'Nama lengkap maksimal 150 karakter.'),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+62|62|0)8[1-9][0-9]{6,11}$/,
      'Gunakan nomor WhatsApp Indonesia yang valid (contoh: 081234567890 atau +6281234567890).'
    ),
  email: z
    .string()
    .trim()
    .email('Masukkan format alamat email yang valid.')
    .max(160)
    .optional()
    .or(z.literal('')),
  packageId: z.coerce.number().int().positive('Silakan pilih paket Umroh.'),
  departureId: z.coerce
    .number()
    .int()
    .positive('Silakan pilih jadwal keberangkatan yang tersedia.'),
  participantCount: z.coerce
    .number()
    .int()
    .min(1, 'Minimal 1 orang peserta.')
    .max(20, 'Maksimal 20 orang peserta per pengajuan.'),
  message: z
    .string()
    .trim()
    .max(1000, 'Catatan tambahan tidak boleh melebihi 1000 karakter.')
    .optional()
    .or(z.literal('')),
});

type RegistrationFormInput = z.input<typeof registrationSchema>;
type RegistrationFormValues = z.output<typeof registrationSchema>;

interface RegistrationFormProps {
  initialPackageId?: number;
  initialDepartureId?: number;
}

export function RegistrationForm({
  initialPackageId,
  initialDepartureId,
}: RegistrationFormProps) {
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingDepartures, setLoadingDepartures] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] =
    useState<RegistrationResponseData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormInput, unknown, RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      packageId: initialPackageId || 0,
      departureId: initialDepartureId || 0,
      participantCount: 1,
      message: '',
    },
  });

  const watchedPackageId = Number(watch('packageId'));
  const watchedDepartureId = Number(watch('departureId'));
  const watchedParticipantCount = Number(watch('participantCount')) || 1;
  const watchedFullName = watch('fullName');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoadingPackages(true);
      setLoadError(null);
      try {
        const res = await fetchPackages({ limit: 50 });
        if (!active) return;
        setPackages(res.items);
        if (
          initialPackageId &&
          res.items.some((p) => p.id === initialPackageId)
        ) {
          setValue('packageId', initialPackageId);
        } else if (res.items.length > 0 && !watchedPackageId) {
          setValue('packageId', res.items[0].id);
        }
      } catch (err) {
        if (!active) return;
        setLoadError(
          extractApiErrorMessage(err, 'Gagal memuat daftar paket Umroh saat ini.')
        );
      } finally {
        if (active) setLoadingPackages(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [initialPackageId, setValue]);

  useEffect(() => {
    if (!watchedPackageId || watchedPackageId <= 0) {
      setDepartures([]);
      return;
    }

    let active = true;
    async function loadDepartures() {
      setLoadingDepartures(true);
      try {
        const rows = await fetchPackageDepartures(watchedPackageId);
        if (!active) return;
        const available = rows.filter(
          (d) => d.status !== 'closed' && d.status !== 'full' && d.quota > 0
        );
        setDepartures(rows);

        if (
          initialDepartureId &&
          available.some((d) => d.id === initialDepartureId)
        ) {
          setValue('departureId', initialDepartureId);
        } else if (available.length > 0) {
          setValue('departureId', available[0].id);
        } else {
          setValue('departureId', 0);
        }
      } catch {
        if (!active) return;
        setDepartures([]);
      } finally {
        if (active) setLoadingDepartures(false);
      }
    }

    loadDepartures();
    return () => {
      active = false;
    };
  }, [watchedPackageId, initialDepartureId, setValue]);

  const selectedPackage = packages.find((p) => p.id === watchedPackageId);
  const selectedDeparture = departures.find((d) => d.id === watchedDepartureId);

  const onSubmit = async (values: RegistrationFormValues) => {
    if (isSubmitting) return;
    setSubmitError(null);

    try {
      const response = await submitRegistration({
        packageId: values.packageId,
        departureId: values.departureId,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        participantCount: values.participantCount,
        message: values.message || undefined,
      });
      setSubmittedResult(response.data);
    } catch (err) {
      setSubmitError(
        extractApiErrorMessage(
          err,
          'Gagal mengirim pendaftaran. Mohon periksa kembali data Anda.'
        )
      );
    }
  };

  if (submittedResult) {
    const waFollowUp = buildWhatsAppUrl({
      packageName: submittedResult.packageName,
      departureDate: submittedResult.departureDate,
      visitorName: watchedFullName,
      participantCount: submittedResult.participantCount,
      customNote: `Nomor Referensi Demo #${submittedResult.registrationId}`,
    });

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: SMOOTH_EASE }}
        className="rounded-xl border border-brand-teal bg-brand-white p-8 shadow-xs sm:p-10"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-teal text-brand-white">
            <CheckCircle2 className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wide text-brand-teal uppercase">
              Berhasil Tercatat (Simulasi)
            </p>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-brand-forest">
              Terima kasih. Pendaftaran minat Anda telah kami simpan.
            </h2>
            <p className="text-sm leading-relaxed text-brand-charcoal">
              Nomor referensi{' '}
              <span className="rounded bg-brand-surface px-1.5 py-0.5 font-mono font-semibold text-brand-forest tabular-nums">
                #{submittedResult.registrationId}
              </span>{' '}
              telah tercatat pada basis data demonstrasi untuk paket{' '}
              <span className="font-semibold text-brand-charcoal">
                {submittedResult.packageName}
              </span>{' '}
              keberangkatan{' '}
              <span className="font-semibold text-brand-charcoal tabular-nums">
                {formatDateLong(submittedResult.departureDate)}
              </span>{' '}
              ({submittedResult.participantCount} jamaah).
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-brand-border pt-6">
          <a
            href={waFollowUp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-teal inline-flex items-center gap-2 px-5 py-2.5 text-sm whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4 text-current" aria-hidden="true" />
            <span>Lanjutkan ke WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmittedResult(null);
              reset({
                fullName: '',
                phone: '',
                email: '',
                packageId: selectedPackage?.id ?? 0,
                departureId: selectedDeparture?.id ?? 0,
                participantCount: 1,
                message: '',
              });
            }}
            className="btn-secondary-outline inline-flex items-center justify-center px-5 py-2.5 text-sm whitespace-nowrap"
          >
            Kirim Pendaftaran Lainnya
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.06 }}
      transition={{ duration: 0.55, ease: SMOOTH_EASE }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-brand-border bg-brand-white p-6 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-md sm:p-8 lg:p-10"
    >
      <div className="border-b border-brand-border pb-6">
        <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-brand-forest">
          Data Pendaftaran Minat Jamaah
        </h2>
        <p className="mt-1 text-sm text-brand-charcoal/80">
          Lengkapi formulir di bawah ini untuk mengajukan pendaftaran minat contoh. Tidak ada permintaan nomor paspor maupun kartu identitas.
        </p>
      </div>

      {loadError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-lg border border-[#D9827A] bg-[#FDF4F3] p-4 text-sm text-[#7A271E]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{loadError}</p>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-lg border border-[#D9827A] bg-[#FDF4F3] p-4 text-sm text-[#7A271E]"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>{submitError}</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Nama Lengkap <span className="text-[#9E2A2B]">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Contoh: Ahmad Fauzi Pratama"
            {...register('fullName')}
            aria-invalid={Boolean(errors.fullName)}
            className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
          />
          {errors.fullName && (
            <p className="mt-1.5 text-xs font-medium text-[#9E2A2B]">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Nomor WhatsApp <span className="text-[#9E2A2B]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Contoh: 081234567890"
            {...register('phone')}
            aria-invalid={Boolean(errors.phone)}
            className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-charcoal tabular-nums placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs font-medium text-[#9E2A2B]">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Alamat Email{' '}
            <span className="text-xs font-normal text-brand-charcoal/70">
              (Opsional)
            </span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Contoh: ahmad@contoh.id"
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-[#9E2A2B]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="packageId"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Pilihan Paket Umroh <span className="text-[#9E2A2B]">*</span>
          </label>
          <select
            id="packageId"
            disabled={loadingPackages}
            {...register('packageId')}
            aria-invalid={Boolean(errors.packageId)}
            className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-charcoal focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none disabled:opacity-60"
          >
            <option value={0}>
              {loadingPackages ? 'Memuat daftar paket...' : 'Pilih paket Umroh'}
            </option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({formatIDR(pkg.price)})
              </option>
            ))}
          </select>
          {errors.packageId && (
            <p className="mt-1.5 text-xs font-medium text-[#9E2A2B]">
              {errors.packageId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="departureId"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Jadwal Keberangkatan <span className="text-[#9E2A2B]">*</span>
          </label>
          <select
            id="departureId"
            disabled={loadingDepartures || departures.length === 0}
            {...register('departureId')}
            aria-invalid={Boolean(errors.departureId)}
            className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-charcoal focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none disabled:opacity-60"
          >
            <option value={0}>
              {loadingDepartures
                ? 'Memuat jadwal keberangkatan...'
                : departures.length === 0
                  ? 'Pilih paket terlebih dahulu'
                  : 'Pilih tanggal keberangkatan'}
            </option>
            {departures.map((dep) => {
              const unavailable =
                dep.status === 'full' ||
                dep.status === 'closed' ||
                dep.quota <= 0;
              return (
                <option key={dep.id} value={dep.id} disabled={unavailable}>
                  {formatDateLong(dep.departure_date)} –{' '}
                  {formatDateLong(dep.return_date)} (
                  {formatDepartureStatusLabel(dep.status, dep.quota)})
                </option>
              );
            })}
          </select>
          {errors.departureId && (
            <p className="mt-1.5 text-xs font-medium text-[#9E2A2B]">
              {errors.departureId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="participantCount"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Jumlah Jamaah <span className="text-[#9E2A2B]">*</span>
          </label>
          <input
            id="participantCount"
            type="number"
            min={1}
            max={20}
            {...register('participantCount')}
            aria-invalid={Boolean(errors.participantCount)}
            className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-charcoal tabular-nums focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
          />
          {errors.participantCount && (
            <p className="mt-1.5 text-xs font-medium text-[#9E2A2B]">
              {errors.participantCount.message}
            </p>
          )}
        </div>

        <div className="flex items-end">
          {selectedPackage && (
            <div className="w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-xs text-brand-charcoal">
              <span className="block text-brand-text-secondary">
                Perkiraan Total Biaya (Contoh)
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-brand-forest tabular-nums">
                {formatIDR(
                  selectedPackage.price * Math.max(watchedParticipantCount, 1)
                )}
              </span>
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-brand-charcoal"
          >
            Catatan Tambahan{' '}
            <span className="text-xs font-normal text-brand-charcoal/70">
              (Opsional)
            </span>
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Tuliskan preferensi kamar (Quad/Triple/Double), kebutuhan pendampingan lansia, atau pertanyaan lainnya..."
            {...register('message')}
            aria-invalid={Boolean(errors.message)}
            className="mt-1.5 w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm text-brand-charcoal placeholder:text-brand-charcoal/55 focus:border-brand-teal focus:bg-brand-white focus:ring-2 focus:ring-brand-teal/20 focus:outline-none"
          />
          {errors.message && (
            <p className="mt-1.5 text-xs font-medium text-[#9E2A2B]">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-brand-border bg-brand-surface p-4 text-xs leading-relaxed text-brand-charcoal">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal"
          aria-hidden="true"
        />
        <p>
          <strong className="font-semibold text-brand-charcoal">
            Pemberitahuan Privasi &amp; Portofolio:
          </strong>{' '}
          Formulir ini mendemonstrasikan validasi sisi klien dan server beserta penyimpanan basis data. Mohon tidak memasukkan nomor paspor, foto KTP, maupun rekam medis asli.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting || loadingPackages}
          className="btn-primary-teal inline-flex items-center justify-center gap-2 px-6 py-3 text-sm whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          {isSubmitting && (
            <Loader2
              className="h-4 w-4 animate-spin text-current"
              aria-hidden="true"
            />
          )}
          <span>
            {isSubmitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
          </span>
        </button>

        {selectedPackage && (
          <a
            href={buildWhatsAppUrl({
              packageName: selectedPackage.name,
              departureDate: selectedDeparture?.departure_date,
              participantCount: watchedParticipantCount,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-outline inline-flex items-center gap-2 px-5 py-2.5 text-sm whitespace-nowrap"
          >
            <MessageCircle className="h-4 w-4 text-brand-teal" aria-hidden="true" />
            <span>Tanya via WhatsApp</span>
          </a>
        )}
      </div>
    </motion.form>
  );
}
