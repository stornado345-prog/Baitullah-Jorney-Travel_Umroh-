import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp.ts';
import { CARD_SPRING, SMOOTH_EASE } from './MotionPrimitives.tsx';

interface FloatingWhatsAppProps {
  packageName?: string;
  departureDate?: string;
}

export function FloatingWhatsApp({ packageName, departureDate }: FloatingWhatsAppProps) {
  const href = buildWhatsAppUrl({
    packageName,
    departureDate,
  });

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Konsultasi melalui WhatsApp"
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, scale: 1.04, transition: CARD_SPRING }}
      whileTap={{ scale: 0.95, transition: CARD_SPRING }}
      transition={{ duration: 0.45, delay: 0.25, ease: SMOOTH_EASE }}
      className="btn-primary-teal fixed right-4 bottom-4 z-50 inline-flex w-fit items-center gap-2 rounded-lg px-3.5 py-2 text-xs shadow-lg whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
    >
      <MessageCircle className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
      <span className="hidden sm:inline">Konsultasi WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </motion.a>
  );
}
