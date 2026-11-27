import { useState } from 'react';
import { Compass } from 'lucide-react';

interface MediaImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function MediaImage({ src, alt, className = '', priority = false }: MediaImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center border border-brand-border bg-brand-surface p-6 text-center text-brand-charcoal ${className}`}
      >
        <Compass className="mb-2 h-7 w-7 text-brand-charcoal" strokeWidth={1.5} aria-hidden="true" />
        <span className="max-w-[22ch] text-xs font-medium leading-relaxed text-brand-charcoal">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
