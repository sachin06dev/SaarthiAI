'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  MessageSquareQuote,
  Calendar,
  Shield,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Read saved theme from localStorage on client mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('saarthi_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        }
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_theme', nextTheme);
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }
  };

  const navLinks = [
    { href: '/', label: lang === 'hi' ? 'होम' : 'Home' },
    { href: '/analyze', label: lang === 'hi' ? 'रिपोर्ट जांचें' : 'Analyze Report', icon: FileText },
    { href: '/doubt-engine', label: lang === 'hi' ? 'डाउट इंजन' : 'Doubt Engine', icon: MessageSquareQuote },
    { href: '/appointments', label: lang === 'hi' ? 'डॉक्टर अपॉइंटमेंट' : 'Appointments', icon: Calendar },
    { href: '/privacy', label: lang === 'hi' ? 'सुरक्षा व नीति' : 'Privacy & Safety', icon: Shield },
  ];

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('saarthi-language-change', { detail: nextLang }));
      localStorage.setItem('saarthi_language', nextLang);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-white">SaarthiAI</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
                  MVP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Understand your report &bull; Prepare for your doctor
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle, Language Switcher & Demo CTA */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-sky-500 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language between English and Hindi"
              className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <span className={lang === 'en' ? 'text-sky-400 font-bold' : 'text-slate-400'}>EN</span>
              <span className="text-slate-600">|</span>
              <span className={lang === 'hi' ? 'text-sky-400 font-bold' : 'text-slate-400'}>हिन्दी</span>
            </button>

            {/* Quick Demo CTA */}
            <Link
              href="/analyze?mode=demo"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/15 hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'डेमो रिपोर्ट' : 'Try Demo'}</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/analyze?mode=demo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-sky-600 text-white"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'hi' ? 'डेमो रिपोर्ट देखें' : 'Try Demo Report'}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
