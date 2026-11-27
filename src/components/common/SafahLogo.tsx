interface BaitullahLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  hoverPeriwinkle?: boolean;
  className?: string;
}

export const BRAND_LOGO_SRC =
  '/assets/aistudio/Logo_Baitullah_Journey_Hijau_Toska_25ffd7d4.png';

/**
 * Baitullah Journey Brand Emblem & Wordmark
 * Displays the official Baitullah Journey crest asset alongside responsive wordmark text.
 */
export function BaitullahLogo({
  size = 'md',
  variant = 'dark',
  hoverPeriwinkle = false,
  className = '',
}: BaitullahLogoProps) {
  const iconDimension =
    size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-10 w-10' : 'h-11 w-11';
  const wordmarkSize =
    size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <span className={`inline-flex items-center gap-3 whitespace-nowrap shrink-0 ${className}`}>
      <span
        className={`${iconDimension} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-teal/55 bg-white p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105`}
      >
        <img
          src={BRAND_LOGO_SRC}
          alt="Logo Baitullah Journey"
          className="h-full w-full rounded-lg object-contain"
        />
      </span>

      <span
        className={`font-['Plus_Jakarta_Sans'] ${wordmarkSize} font-bold tracking-tight transition-colors duration-200 ${
          variant === 'light'
            ? 'text-brand-charcoal'
            : hoverPeriwinkle
              ? 'text-brand-white group-hover:text-brand-periwinkle group-active:text-brand-periwinkle group-focus-visible:text-brand-periwinkle'
              : 'text-brand-white'
        }`}
      >
        Baitullah{' '}
        <span
          className={
            variant === 'light'
              ? 'text-animated-header-dark font-extrabold'
              : hoverPeriwinkle
                ? 'transition-colors duration-200 group-hover:text-brand-periwinkle group-active:text-brand-periwinkle group-focus-visible:text-brand-periwinkle'
                : 'text-animated-periwinkle-dark'
          }
        >
          Journey
        </span>
      </span>
    </span>
  );
}

export const SafahLogo = BaitullahLogo;
