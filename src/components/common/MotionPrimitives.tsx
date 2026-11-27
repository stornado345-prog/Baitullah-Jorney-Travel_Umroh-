import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
  type Transition,
} from 'motion/react';

export type RevealVariant =
  | 'fadeUp'
  | 'fadeDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'blurReveal';

const REVEAL_VARIANTS: Record<
  RevealVariant,
  {
    hidden: Record<string, string | number>;
    visible: Record<string, string | number>;
  }
> = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -18 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -28 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 28 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  blurReveal: {
    hidden: { opacity: 0, y: 14, filter: 'blur(5px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
};

export const SMOOTH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const CARD_SPRING: Transition = {
  type: 'spring',
  stiffness: 340,
  damping: 25,
  mass: 0.85,
};

interface RevealBlockProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  immediate?: boolean;
}

/**
 * Bidirectional scroll-reveal block with varied entrance presets.
 * Replays smoothly when re-entering the viewport while scrolling up or down.
 */
export function RevealBlock({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.58,
  className = '',
  immediate = false,
}: RevealBlockProps) {
  const preset = REVEAL_VARIANTS[variant];

  if (immediate) {
    return (
      <motion.div
        initial={preset.hidden}
        animate={preset.visible}
        transition={{ duration, delay, ease: SMOOTH_EASE }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={preset.hidden}
      whileInView={preset.visible}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration, delay, ease: SMOOTH_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealParagraphProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}

/**
 * Subtle staggered paragraph reveal for editorial prose.
 */
export function RevealParagraph({
  children,
  delay = 0.08,
  className = '',
  immediate = false,
}: RevealParagraphProps) {
  if (immediate) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay, ease: SMOOTH_EASE }}
        className={className}
      >
        {children}
      </motion.p>
    );
  }

  return (
    <motion.p
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: SMOOTH_EASE }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

interface InteractiveCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  index?: number;
  variant?: RevealVariant;
  className?: string;
}

/**
 * Interactive card with bidirectional staggered scroll reveal,
 * hover lift/scale (1.02), and natural spring press bounce (0.97).
 */
export function InteractiveCard({
  children,
  index = 0,
  variant = 'fadeUp',
  className = '',
  ...rest
}: InteractiveCardProps) {
  const preset = REVEAL_VARIANTS[variant];
  const delay = Math.min(index, 5) * 0.07;

  return (
    <motion.div
      initial={preset.hidden}
      whileInView={preset.visible}
      viewport={{ once: false, amount: 0.08 }}
      whileHover={{ y: -5, scale: 1.02, transition: CARD_SPRING }}
      whileTap={{ scale: 0.97, transition: CARD_SPRING }}
      transition={{ duration: 0.54, delay, ease: SMOOTH_EASE }}
      className={`group ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxFrameProps {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
}

/**
 * Overflow-safe interactive image frame with viewport zoom-in reveal,
 * subtle desktop mouse parallax, and smooth hover scale.
 */
export function ParallaxFrame({
  children,
  className = '',
  immediate = false,
}: ParallaxFrameProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 180, damping: 24 });
  const springY = useSpring(rawY, { stiffness: 180, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return;
    }
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(relX * -8);
    rawY.set(relY * -8);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={frameRef}
      initial={{ opacity: 0, scale: 0.96 }}
      {...(immediate
        ? { animate: { opacity: 1, scale: 1 } }
        : {
            whileInView: { opacity: 1, scale: 1 },
            viewport: { once: false, amount: 0.1 },
          })}
      transition={{ duration: 0.65, ease: SMOOTH_EASE }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group overflow-hidden ${className}`}
    >
      <motion.div
        style={{ x: springX, y: springY }}
        initial={{ scale: 1.02 }}
        whileHover={{ scale: 1.06 }}
        transition={{ scale: { duration: 0.45, ease: SMOOTH_EASE } }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
