'use client';

import React from 'react';
import { Calendar, ShieldCheck, HeartHandshake } from 'lucide-react';
import { AppointmentBookingView } from '@/components/appointments/AppointmentBookingView';

export default function AppointmentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs text-sky-400 font-semibold mb-1">
          <Calendar className="w-4 h-4" />
          <span>Step 4: Continuity of Care &bull; Clinical Dialogue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Book Doctor Consultation</h1>
        <p className="text-xs text-slate-400">
          Connect with participating clinicians and optionally share your decoded report with explicit consent.
        </p>
      </div>

      {/* Safety & Consent Notice */}
      <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 flex items-start space-x-3 text-xs text-sky-200">
        <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-white">Strict Privacy &amp; Consent Principle:</span>
          <p className="text-slate-300">
            Your laboratory report is <em>never</em> shared without your explicit opt-in checkbox authorization.
            In this prototype, participating doctor profiles and slots are clearly designated as{' '}
            <strong className="text-amber-300">Simulated Demo Partners</strong>.
          </p>
        </div>
      </div>

      {/* Main Booking View */}
      <AppointmentBookingView />
    </div>
  );
}
