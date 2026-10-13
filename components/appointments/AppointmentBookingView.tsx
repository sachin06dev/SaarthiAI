'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  ChevronRight,
  ArrowLeft,
  Building,
} from 'lucide-react';
import {
  DoctorProfile,
  SEEDED_DOCTORS,
  createAppointmentBooking,
  AppointmentConfirmation,
} from '@/lib/services/appointment-service';

export function AppointmentBookingView() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(SEEDED_DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>(SEEDED_DOCTORS[0].slots[0]);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [shareConsent, setShareConsent] = useState(true);
  const [confirmation, setConfirmation] = useState<AppointmentConfirmation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedDoctor =
    SEEDED_DOCTORS.find((d) => d.id === selectedDoctorId) || SEEDED_DOCTORS[0];

  const handleDoctorChange = (doc: DoctorProfile) => {
    setSelectedDoctorId(doc.id);
    setSelectedSlot(doc.slots[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!patientPhone.trim() || patientPhone.trim().length < 8) {
      setErrorMsg('Please enter a valid contact phone number.');
      return;
    }

    setErrorMsg(null);
    const result = createAppointmentBooking({
      doctorId: selectedDoctor.id,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      appointmentDate: selectedDate,
      slotTime: selectedSlot,
      patientNotes: patientNotes.trim(),
      shareReportConsent: shareConsent,
      selectedReportName: 'Active_Decoded_Laboratory_Report.pdf',
    });

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem('saarthi_saved_appointments') || '[]');
        existing.push(result);
        localStorage.setItem('saarthi_saved_appointments', JSON.stringify(existing));
      } catch {}
    }

    setConfirmation(result);
  };

  if (confirmation) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300 uppercase tracking-wider mb-0.5">
                Simulated Demo Booking Confirmed
              </span>
              <h2 className="text-xl font-bold text-white">Consultation Scheduled Successfully</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-emerald-900/40 text-xs">
            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px]">BOOKING REFERENCE:</span>
                <span className="text-white font-mono font-bold text-sm">{confirmation.bookingId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">CONSULTING PHYSICIAN:</span>
                <span className="text-white font-semibold">{confirmation.doctor.name}</span>
                <span className="text-slate-400 block">{confirmation.doctor.specialty} &bull; {confirmation.doctor.clinicName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">APPOINTMENT TIME:</span>
                <span className="text-emerald-300 font-semibold">{confirmation.appointmentDate} at {confirmation.slotTime}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px]">PATIENT DETAILS:</span>
                <span className="text-white font-semibold">{confirmation.patientName}</span>
                <span className="text-slate-400 block">Phone: {confirmation.patientPhone}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-semibold mb-1">
                  REPORT ACCESS STATUS:
                </span>
                {confirmation.reportSharingStatus.shared ? (
                  <div className="space-y-1 text-emerald-300">
                    <div className="flex items-center space-x-1.5 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Report Shared with Explicit Consent</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Doctor access granted via time-limited secure link (expires in 48 hours).
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Audit: {confirmation.reportSharingStatus.auditLog}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Report kept private by patient choice. Not shared with clinic.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2">
          <button
            onClick={() => setConfirmation(null)}
            className="text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Book another consultation</span>
          </button>
          <Link
            href="/results"
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold"
          >
            Return to Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step A: Select Participating Doctor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>1. Select Participating Doctor / Clinic</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Network Status: <strong className="text-amber-400">Simulated Demo Partner</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SEEDED_DOCTORS.map((doc) => {
            const isSelected = doc.id === selectedDoctorId;
            return (
              <div
                key={doc.id}
                onClick={() => handleDoctorChange(doc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500/80 shadow-md shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs">
                      {doc.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm">{doc.name}</h3>
                      <p className="text-[11px] text-sky-400">{doc.specialty}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300">{doc.consultationFee}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{doc.clinicName}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{doc.location}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step B: Select Date & Time Slot */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>2. Select Available Slot</span>
        </h2>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">Available Days:</span>
            <div className="flex items-center space-x-2">
              {selectedDoctor.availableDays.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedDate === day
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">Time Slots:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selectedDoctor.slots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    selectedSlot === slot
                      ? 'bg-sky-950 border-sky-400 text-sky-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step C: Patient Details & Explicit Sharing Consent */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <span>3. Patient Details &amp; Consent-Based Sharing</span>
        </h2>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Full Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="text-slate-300 font-medium block mb-1">
              Optional Health Context / Questions for Doctor
            </label>
            <input
              type="text"
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="e.g. High fasting blood sugar on recent metabolic test"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Non-Negotiable Explicit Consent Checkbox */}
          <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/50 space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={shareConsent}
                onChange={(e) => setShareConsent(e.target.checked)}
                className="mt-0.5 rounded border-sky-700 text-sky-500 focus:ring-sky-500 bg-slate-900 w-4 h-4"
              />
              <span className="text-slate-300 leading-relaxed">
                <strong className="text-white">Explicit Patient Consent:</strong> I authorize SaarthiAI
                to share my decoded laboratory summary report with {selectedDoctor.name} for this
                consultation.
              </span>
            </label>
            <p className="text-[11px] text-slate-400 pl-7 leading-normal">
              Access is provided through an authenticated, time-limited doctor portal token (48 hours expiry).
              Reports are never made publicly available.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Booking Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <p className="text-[11px] text-slate-500">
          Booking is processed via simulated demo partner API &bull; No upfront payment required
        </p>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all"
        >
          <span>Confirm Consultation ({selectedDoctor.consultationFee})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
