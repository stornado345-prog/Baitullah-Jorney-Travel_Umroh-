import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { CARD_SPRING, SMOOTH_EASE } from '../common/MotionPrimitives.tsx';
import { SafahLogo } from '../common/SafahLogo.tsx';

const NAV_LINKS = [
  { to: '/', label: 'Beranda' },
  { to: '/packages', label: 'Paket Umroh' },
  { to: '/about', label: 'Tentang Kami' },
  { to: '/contact', label: 'Hubungi Kami' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled
          ? 'border-brand-teal/55 bg-brand-charcoal/95 shadow-lg shadow-black/25 backdrop-blur-md'
          : 'border-brand-teal/40 bg-brand-charcoal'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.97 }}
          transition={CARD_SPRING}
          className="shrink-0"
        >
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="group whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-periwinkle"
          >
            <SafahLogo size="sm" variant="dark" hoverPeriwinkle />
          </Link>
        </motion.div>

        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-7 font-['Plus_Jakarta_Sans'] text-sm tracking-tight"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `underline-animated-periwinkle py-1 whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-periwinkle ${
                  isActive
                    ? 'is-active font-bold text-brand-white hover:text-brand-periwinkle active:text-brand-periwinkle focus-visible:text-brand-periwinkle'
                    : 'font-semibold text-brand-white hover:text-brand-periwinkle active:text-brand-periwinkle focus-visible:text-brand-periwinkle'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={CARD_SPRING}
            className="hidden md:block shrink-0"
          >
            <Link
              to="/register"
              className="btn-primary-teal inline-flex shrink-0 items-center justify-center px-5 py-2.5 font-['Plus_Jakarta_Sans'] text-sm text-brand-white whitespace-nowrap hover:!text-brand-periwinkle active:!text-brand-periwinkle focus-visible:!text-brand-periwinkle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-periwinkle"
            >
              Daftar Sekarang
            </Link>
          </motion.div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            transition={CARD_SPRING}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="btn-primary-teal inline-flex items-center justify-center p-2.5 text-brand-white md:hidden hover:!text-brand-periwinkle active:!text-brand-periwinkle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-periwinkle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-current" />
            ) : (
              <Menu className="h-5 w-5 text-current" />
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: SMOOTH_EASE }}
            className="overflow-hidden border-t border-white/15 bg-brand-charcoal md:hidden"
          >
            <nav
              aria-label="Navigasi Seluler"
              className="flex flex-col gap-1 px-4 py-4 font-['Plus_Jakarta_Sans']"
            >
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-teal font-bold text-brand-white hover:text-brand-periwinkle active:text-brand-periwinkle'
                        : 'font-semibold text-brand-white hover:bg-white/10 hover:text-brand-periwinkle active:text-brand-periwinkle'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="btn-primary-teal mt-2 inline-flex items-center justify-center px-4 py-2.5 text-sm text-brand-white hover:!text-brand-periwinkle active:!text-brand-periwinkle"
              >
                Daftar Sekarang
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
