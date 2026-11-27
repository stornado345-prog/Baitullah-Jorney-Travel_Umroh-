import { useId, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export interface SafahIslamicPatternProps {
  variant?: 'section' | 'card' | 'compact';
  tone?: 'periwinkle' | 'teal' | 'forest';
  className?: string;
}

/**
 * Logo-Inspired Islamic Geometric & Architectural Pattern
 * Supports Soft Periwinkle (#9FBCFF) accents on Deep Forest Green (#072C24),
 * Deep Teal (#15665F) on Pure White (#FFFFFF), and Deep Forest Green (#072C24)
 * on Soft Periwinkle (#9FBCFF) surfaces, with subtle scroll-linked parallax motion.
 */
export function SafahIslamicPattern({
  variant = 'card',
  tone = 'periwinkle',
  className = '',
}: SafahIslamicPatternProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rawId = useId().replace(/:/g, '');
  const topMaskId = `safah-crescent-top-${rawId}`;
  const bottomMaskId = `safah-crescent-bottom-${rawId}`;
  const compactMaskId = `safah-crescent-compact-${rawId}`;
  const patternId = `safah-geo-pattern-${rawId}`;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const topOrnamentY = useTransform(scrollYProgress, [0, 1], [-12, 14]);
  const bottomOrnamentY = useTransform(scrollYProgress, [0, 1], [14, -12]);

  const isTealTone = tone === 'teal';
  const isForestTone = tone === 'forest';
  const ornamentClass = isForestTone
    ? 'animate-teal-ornament text-brand-forest'
    : isTealTone
      ? 'animate-teal-ornament text-brand-teal'
      : 'animate-periwinkle-ornament text-brand-periwinkle';
  const latticeColorClass = isForestTone ? 'text-brand-forest' : 'text-brand-teal';
  const latticeOpacity = isForestTone
    ? 'opacity-[0.14]'
    : isTealTone
      ? 'opacity-[0.13]'
      : 'opacity-[0.22]';

  if (variant === 'compact') {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className={`${ornamentClass} absolute -right-1.5 -top-1.5 h-10 w-10`}
        >
          <defs>
            <mask id={compactMaskId}>
              <rect width="64" height="64" fill="black" />
              <circle cx="30" cy="34" r="15" fill="white" />
              <circle cx="36.5" cy="30" r="12" fill="black" />
            </mask>
          </defs>
          <circle cx="30" cy="34" r="15" fill="currentColor" mask={`url(#${compactMaskId})`} />
          <g transform="translate(41 25)" fill="currentColor">
            <rect x="-3.2" y="-3.2" width="6.4" height="6.4" />
            <rect x="-3.2" y="-3.2" width="6.4" height="6.4" transform="rotate(45)" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Islamic Geometric Star & Arch Lattice */}
      <svg className={`absolute inset-0 h-full w-full ${latticeColorClass} ${latticeOpacity}`}>
        <defs>
          <pattern
            id={patternId}
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M48 8 L48 24 M48 72 L48 88 M8 48 L24 48 M72 48 L88 48"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <path
              d="M16 96 V52 C16 32 30 20 48 12 C66 20 80 32 80 52 V96"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeOpacity="0.65"
              fill="none"
            />
            <g transform="translate(48 48)" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.75" fill="none">
              <rect x="-9" y="-9" width="18" height="18" />
              <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" />
              <circle cx="0" cy="0" r="2.2" fill="currentColor" fillOpacity="0.65" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Top-Right Architectural Arch & Crescent Light Accent with Subtle Parallax */}
      <motion.svg
        viewBox="0 0 180 180"
        fill="none"
        style={{ y: topOrnamentY }}
        className={`${ornamentClass} absolute -right-6 -top-6 will-change-transform ${
          variant === 'section' ? 'h-56 w-56' : 'h-36 w-36'
        }`}
      >
        <defs>
          <mask id={topMaskId}>
            <rect width="180" height="180" fill="black" />
            <circle cx="86" cy="92" r="36" fill="white" />
            <circle cx="101" cy="82" r="30" fill="black" />
          </mask>
        </defs>

        <path
          d="M34 166 V94 C34 56 58 34 90 18 C122 34 146 56 146 94 V166"
          stroke="currentColor"
          strokeWidth="1.3"
          opacity="0.7"
        />

        <circle
          cx="86"
          cy="92"
          r="36"
          fill="currentColor"
          mask={`url(#${topMaskId})`}
        />
        <g transform="translate(110 72)" fill="currentColor">
          <rect x="-7.5" y="-7.5" width="15" height="15" />
          <rect x="-7.5" y="-7.5" width="15" height="15" transform="rotate(45)" />
        </g>
        <g transform="translate(128 98)" fill="#15665F">
          <rect x="-3.5" y="-3.5" width="7" height="7" />
          <rect x="-3.5" y="-3.5" width="7" height="7" transform="rotate(45)" />
        </g>
      </motion.svg>

      {/* Bottom-Left 8-Point Star & Crescent with Subtle Parallax */}
      <motion.svg
        viewBox="0 0 130 130"
        fill="none"
        style={{ y: bottomOrnamentY, animationDelay: '3s' }}
        className={`${ornamentClass} absolute -bottom-6 -left-6 will-change-transform ${
          variant === 'section' ? 'h-44 w-44' : 'h-28 w-28'
        }`}
      >
        <defs>
          <mask id={bottomMaskId}>
            <rect width="130" height="130" fill="black" />
            <circle cx="66" cy="60" r="30" fill="white" />
            <circle cx="53" cy="52" r="24" fill="black" />
          </mask>
        </defs>
        <g transform="translate(66 60)" stroke="currentColor" strokeWidth="1" opacity="0.55">
          <rect x="-38" y="-38" width="76" height="76" />
          <rect x="-38" y="-38" width="76" height="76" transform="rotate(45)" />
        </g>
        <circle cx="66" cy="60" r="30" fill="currentColor" mask={`url(#${bottomMaskId})`} />
        <g transform="translate(46 44)" fill="currentColor">
          <rect x="-5.5" y="-5.5" width="11" height="11" />
          <rect x="-5.5" y="-5.5" width="11" height="11" transform="rotate(45)" />
        </g>
      </motion.svg>
    </div>
  );
}

export const GreenCrescentDecoration = SafahIslamicPattern;
export const IslamicGreenDecoration = SafahIslamicPattern;
export const GreenOrnament = SafahIslamicPattern;
