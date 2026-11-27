import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { SMOOTH_EASE } from './MotionPrimitives.tsx';

interface ScrollRevealHeadingProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delayMs?: number;
}

/**
 * Bidirectional scroll-triggered heading reveal with soft blur + vertical settle.
 * Replays naturally when scrolling up or down, and respects MotionConfig reducedMotion.
 */
export function ScrollRevealHeading({
  children,
  className = '',
  as = 'h2',
  delayMs = 0,
}: ScrollRevealHeadingProps) {
  const MotionTag =
    as === 'h1' ? motion.h1 : as === 'h3' ? motion.h3 : motion.h2;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        duration: 0.58,
        delay: delayMs / 1000,
        ease: SMOOTH_EASE,
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
