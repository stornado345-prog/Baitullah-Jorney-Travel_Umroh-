import type { ReactNode } from 'react';
import { Footer } from '../components/layout/Footer.tsx';
import { Navbar } from '../components/layout/Navbar.tsx';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp.tsx';

interface MainLayoutProps {
  children: ReactNode;
  whatsappContext?: {
    packageName?: string;
    departureDate?: string;
  };
}

export function MainLayout({ children, whatsappContext }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-white text-brand-charcoal">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp
        packageName={whatsappContext?.packageName}
        departureDate={whatsappContext?.departureDate}
      />
    </div>
  );
}
