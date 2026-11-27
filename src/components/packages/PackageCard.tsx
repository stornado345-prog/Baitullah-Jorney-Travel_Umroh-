import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Calendar, Plane } from 'lucide-react';
import type { UmrahPackage } from '../../types/travel.ts';
import { formatDateLong, formatIDR } from '../../utils/formatters.ts';
import { InteractiveCard } from '../common/MotionPrimitives.tsx';
import { MediaImage } from '../common/MediaImage.tsx';

interface PackageCardProps {
  pkg: UmrahPackage;
  index?: number;
}

export function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  return (
    <InteractiveCard
      index={index}
      variant="fadeUp"
      className="flex flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-white shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-brand-teal hover:shadow-lg"
    >
      <Link
        to={`/packages/${pkg.slug}`}
        className="block aspect-[4/3] overflow-hidden bg-brand-surface"
      >
        <MediaImage
          src={pkg.thumbnail}
          alt={`${pkg.name} — suasana hotel dan Masjid suci`}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-brand-text-secondary">
          <span className="tabular-nums">
            {pkg.duration_days} Hari · {pkg.duration_nights} Malam
          </span>
          <span aria-hidden="true" className="font-bold text-brand-teal">
            ·
          </span>
          <span>Paket Contoh</span>
        </div>

        <h3 className="mt-2 font-['Plus_Jakarta_Sans'] text-xl font-semibold tracking-tight text-brand-charcoal">
          <Link
            to={`/packages/${pkg.slug}`}
            className="underline-animated-forest pb-0.5 transition-colors hover:text-brand-teal"
          >
            {pkg.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-charcoal/85">
          {pkg.description}
        </p>

        <dl className="mt-5 space-y-2 border-t border-brand-border pt-4 text-xs text-brand-charcoal/85">
          <div className="flex items-start gap-2">
            <Calendar
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            <div>
              <dt className="sr-only">Keberangkatan Berikutnya</dt>
              <dd className="tabular-nums">
                Keberangkatan:{' '}
                <span className="font-semibold text-brand-charcoal">
                  {pkg.next_departure_date
                    ? formatDateLong(pkg.next_departure_date)
                    : 'Sesuai permintaan'}
                </span>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Plane
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
            <div>
              <dt className="sr-only">Maskapai</dt>
              <dd>{pkg.airline}</dd>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Building2
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            <div>
              <dt className="sr-only">Hotel Makkah</dt>
              <dd className="line-clamp-1">{pkg.makkah_hotel}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-brand-border pt-4">
          <div>
            <span className="block text-xs text-brand-text-secondary">
              Perkiraan biaya mulai
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold tracking-tight text-brand-forest tabular-nums">
              {formatIDR(pkg.price)}
            </span>
          </div>

          <Link
            to={`/packages/${pkg.slug}`}
            className="btn-primary-teal inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-xs whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          >
            <span>Lihat Detail</span>
            <ArrowRight
              className="h-3.5 w-3.5 text-current transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </InteractiveCard>
  );
}
