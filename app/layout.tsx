import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BannerNotice } from '@/components/layout/BannerNotice';

export const metadata: Metadata = {
  title: 'SaarthiAI — Understand Your Medical Report | Prepare for the Doctor',
  description:
    'Patient-first medical report understanding platform. AI explains terms, deterministic rules compare against verified ranges, and doctors diagnose.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen selection:bg-sky-500/30 selection:text-sky-200">
        <BannerNotice />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
