'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Share2,
  Calendar,
  Languages,
  Mic,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SaarthiShaderBackdrop } from '@/components/visuals/SaarthiShaderBackdrop';
import { SaarthiHeroFallback } from '@/components/visuals/SaarthiHeroFallback';

// Lazy-load 3D Hero Scene with strict client-only fallback
const SaarthiHeroScene = dynamic(
  () => import('@/components/visuals/SaarthiHeroScene').then((mod) => mod.SaarthiHeroScene),
  {
    ssr: false,
    loading: () => <SaarthiHeroFallback />,
  }
);

export default function HomePage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Upload Reports',
      desc: 'Submit single or multiple PDF or image reports in one session. Your files remain temporary and secure.',
      icon: FileText,
    },
    {
      number: '02',
      title: 'Verify Extraction',
      desc: 'Review parsed test names, values, and report-printed ranges with low-confidence alerts and full audit tracking.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Understand Results',
      desc: 'Grounded explanations clarify clinical jargon, while deterministic rules compare values only against verified ranges.',
      icon: Activity,
    },
    {
      number: '04',
      title: 'Prepare for Doctor',
      desc: 'Receive neutral questions to ask your physician, ask doubts by voice or text, and export a clean report.',
      icon: Calendar,
    },
  ];

  const features = [
    {
      title: 'Multi-Report Upload',
      desc: 'Compare multiple dates and documents while strictly preserving source, page, and date provenance.',
      icon: Layers,
      tag: 'Multi-Doc',
    },
    {
      title: 'Extraction Review & Audit',
      desc: 'Never accept blind OCR. Easily correct numbers or units before any rule comparison occurs.',
      icon: CheckCircle2,
      tag: 'Transparency',
    },
    {
      title: 'Report-Sourced & Indian Ranges',
      desc: 'Prioritizes ranges printed on your lab report, with reviewed Indian study fallback and zero fabricated ranges.',
      icon: ShieldCheck,
      tag: 'Strict Safety',
    },
    {
      title: 'Voice-Enabled Doubt Engine',
      desc: 'Ask follow-up questions in English or Hindi. Speaks answers out loud with automatic browser detection.',
      icon: Mic,
      tag: 'Voice & Text',
    },
    {
      title: 'Neutral Doctor Questions',
      desc: 'Empowers you with thoughtful, respectful questions to ask your physician at your next consultation.',
      icon: HelpCircle,
      tag: 'Doctor-Ready',
    },
    {
      title: 'PDF & WhatsApp Sharing',
      desc: 'Export verified PDF summaries with Web Share API and sensible download fallback for WhatsApp.',
      icon: Share2,
      tag: 'Export Ready',
    },
  ];

  const faqs = [
    {
      q: 'Does SaarthiAI provide medical diagnoses or tell me what medicine to take?',
      a: 'No, absolutely not. SaarthiAI operates under a non-negotiable safety contract: AI explains concepts, deterministic rules compare numbers, and only qualified doctors diagnose. The platform will safely refuse all requests for disease diagnoses, prescriptions, and drug dosages.',
    },
    {
      q: 'How are reference intervals determined?',
      a: 'We use a strict 3-tier hierarchy: (1) Range printed on your own lab report; (2) Curated, source-cited Indian laboratory reference records with documented provenance; (3) If no verified range exists, we display "No verified applicable range" and do not classify the number.',
    },
    {
      q: 'Can I test SaarthiAI without uploading my personal documents?',
      a: 'Yes! SaarthiAI includes three pre-configured synthetic demo scenarios (Clean Panel, Mixed Out-of-Range Panel, and Low-Confidence Panel) that run completely offline without external keys.',
    },
    {
      q: 'How long are my uploaded reports kept?',
      a: 'Reports are stored in-memory for 1 hour by default for your active session and are never retained permanently or sold. You can also clear your session at any time.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <SaarthiShaderBackdrop>
        <section className="pt-4 sm:pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-950/70 border border-sky-800/60 text-sky-400 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Patient Education &bull; Not an AI Doctor</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Medical reports weren&apos;t written for patients.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                  Let&apos;s make them understandable.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Decode laboratory parameters, verify extracted values, and prepare meaningful questions
                for your upcoming doctor consultation—powered by deterministic rule comparisons and zero
                invented ranges.
              </p>

              {/* Safety Motto Card */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 max-w-xl mx-auto lg:mx-0 flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-ping" />
                <p>
                  <strong className="text-white">Safety Principle:</strong> AI explains. Rules compare.
                  Doctors diagnose.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/analyze"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/25 hover:opacity-95 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Decode My Report</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/analyze?mode=demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Try Demo Report (No Upload)</span>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-4 text-xs text-slate-400 pt-1">
                <span>&bull; English &amp; हिन्दी</span>
                <span>&bull; 6 Core Categories</span>
                <span>&bull; Zero Key Required</span>
              </div>
            </div>

            {/* Right Column: 3D Visual with CSS Fallback */}
            <div className="lg:col-span-5">
              <SaarthiHeroScene />
            </div>
          </div>
        </section>
      </SaarthiShaderBackdrop>

      {/* 4-Step Patient Journey */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How SaarthiAI Works
          </h2>
          <p className="text-slate-400 text-sm">
            A transparent 4-step pipeline designed to keep you in control and informed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-sky-500/40">{step.number}</span>
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Synthetic Report Preview Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-800/60">
                Synthetic Sample Preview
              </span>
              <span className="text-xs text-slate-400">Apollo Diagnostics Synthetic Lab</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Sample Decoded Panel (Complete Blood Count)
            </h3>
          </div>
          <Link
            href="/analyze?mode=demo"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            <span>Open Interactive Demo Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Hemoglobin */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Hemoglobin</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                IN RANGE
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-100">14.2 <span className="text-xs text-slate-400">g/dL</span></div>
            <p className="text-[11px] text-slate-400">
              Report Range: 13.0 - 17.0 g/dL &bull; Transports oxygen throughout red blood cells.
            </p>
          </div>

          {/* Card 2: Fasting Blood Glucose */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Fasting Blood Glucose</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800/50">
                ABOVE RANGE
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-100">118 <span className="text-xs text-slate-400">mg/dL</span></div>
            <p className="text-[11px] text-slate-400">
              Report Range: 70 - 100 mg/dL &bull; Evaluates baseline fasting carbohydrate metabolism.
            </p>
          </div>

          {/* Card 3: Qualitative Blood Group */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">ABO / Rh Blood Group</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950 text-purple-400 border border-purple-800/50">
                CATEGORICAL
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-100">B Positive (B+)</div>
            <p className="text-[11px] text-slate-400">
              Categorical antigen classification &bull; Not coerced into numeric rules.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for Accuracy &amp; Patient Trust
          </h2>
          <p className="text-slate-400 text-sm">
            Core features that bridge the gap between technical laboratory documents and informed doctor visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm">
            Key insights into SaarthiAI&apos;s architectural guardrails and educational purpose.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950/70 via-indigo-950/60 to-slate-950/80 border border-sky-800/40 text-center space-y-6 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to decode your report?
          </h2>
          <p className="text-sm text-slate-300">
            Start a session in seconds. Zero account required for immediate analysis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/30 transition-colors"
          >
            Upload Laboratory Report
          </Link>
          <Link
            href="/analyze?mode=demo"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            Launch Demo Mode
          </Link>
        </div>
      </section>
    </div>
  );
}
