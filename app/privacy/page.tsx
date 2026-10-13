'use client';

import React from 'react';
import { ShieldCheck, Lock, Clock, EyeOff, FileText, AlertTriangle, Cpu } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparent Data Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy, Safety Contract &amp; Disclosures
        </h1>
        <p className="text-slate-400 text-sm">
          Understanding how SaarthiAI safeguards your laboratory data, enforces strict medical boundaries,
          and handles temporary file processing.
        </p>
      </div>

      {/* Safety Contract Highlight */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-base">
          <Cpu className="w-5 h-5" />
          <span>The Non-Negotiable Medical Safety Contract</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong className="text-white">AI Explains. Rules Compare. Doctors Diagnose.</strong> SaarthiAI is an
          educational assistant built to decode complex clinical terms. It is strictly prohibited from diagnosing
          diseases, claiming a condition is present, suggesting drug dosages, modifying prescriptions, or
          inferring that you do not need medical attention.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-400">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-rose-400 font-semibold block mb-1">PROHIBITED BEHAVIOR:</span>
            No automated diagnoses, medication adjustments, or fabricated reference ranges.
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-emerald-400 font-semibold block mb-1">PERMITTED BEHAVIOR:</span>
            Plain-language explanations, deterministic interval comparisons, and doctor consultation questions.
          </div>
        </div>
      </div>

      {/* Retention and Privacy Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <Clock className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-semibold text-white">Temporary Retention</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Uploaded reports are held in temporary memory for a maximum of 1 hour during your active session
            and are then permanently purged. No long-term storage exists without explicit patient booking consent.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <Lock className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Zero Public URLs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your medical reports are never exposed via public static URLs. Any sharing with an associated doctor
            requires explicit consent and uses time-limited, access-controlled tokens.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <EyeOff className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Third-Party Processing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            In offline sandbox mode, all extraction and explanations run entirely locally with zero external
            network calls. If live Gemini or external OCR is enabled, external transmission is clearly disclosed.
          </p>
        </div>
      </div>

      {/* Reference Range Policy */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <span>Strict Reference Range Policy</span>
        </h2>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Reference intervals vary between laboratory methodologies, instrumentation, and patient populations.
            SaarthiAI never performs a free-form search or prompts an LLM to guess a reference range.
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-400">
            <li>
              <strong className="text-slate-200">Priority 1 (Report-Printed):</strong> We use the range printed
              on your specific laboratory report whenever it can be reliably parsed and matched.
            </li>
            <li>
              <strong className="text-slate-200">Priority 2 (Curated Indian Study Fallback):</strong> If the
              report does not supply a range, we consult our reviewed catalogue of peer-reviewed Indian population
              studies with full citation and provenance.
            </li>
            <li>
              <strong className="text-slate-200">Priority 3 (No Verified Range):</strong> If no verified, applicable
              range matches your analyte and unit, we mark it as <em>NO_VERIFIED_RANGE</em> and do NOT classify it
              as in-range or out-of-range.
            </li>
          </ol>
        </div>
      </div>

      {/* Prototype Limitations Notice */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start space-x-3 text-xs text-amber-200/90">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-amber-300">Prototype Disclaimer</span>
          <p>
            SaarthiAI is a hackathon-engineered patient education prototype. It has not received regulatory
            certification (such as FDA or CDSCO clearance) and does not claim HIPAA/GDPR clinical compliance
            without formal institutional auditing. Always consult a licensed medical practitioner for health advice.
          </p>
        </div>
      </div>
    </div>
  );
}
