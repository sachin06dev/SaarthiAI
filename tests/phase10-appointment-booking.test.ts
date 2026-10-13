import { describe, it, expect } from 'vitest';
import {
  SEEDED_DOCTORS,
  createAppointmentBooking,
} from '../lib/services/appointment-service';
import { persistAppointment } from '../lib/db/supabase';

describe('Phase 10: Doctor Consultation and Consent-Based Sharing', () => {
  it('supplies seeded partner doctors with clearly labeled simulated partner type', () => {
    expect(SEEDED_DOCTORS.length).toBeGreaterThanOrEqual(4);
    for (const doc of SEEDED_DOCTORS) {
      expect(doc.partnerType).toBe('SIMULATED_DEMO_PARTNER');
      expect(doc.slots.length).toBeGreaterThan(0);
      expect(doc.availableDays.length).toBeGreaterThan(0);
      expect(doc.consultationFee).toContain('₹');
    }
  });

  it('creates confirmed appointment booking with time-limited report access when patient consents', () => {
    const booking = createAppointmentBooking({
      doctorId: SEEDED_DOCTORS[0].id,
      patientName: 'Rahul Verma',
      patientPhone: '+91 98765 43210',
      appointmentDate: 'Tomorrow',
      slotTime: '10:00 AM',
      shareReportConsent: true,
      selectedReportName: 'Metabolic_Panel.pdf',
    });

    expect(booking.bookingId.startsWith('SAARTHI-APT-')).toBe(true);
    expect(booking.status).toBe('CONFIRMED_SIMULATED');
    expect(booking.doctor.id).toBe(SEEDED_DOCTORS[0].id);
    expect(booking.patientName).toBe('Rahul Verma');
    expect(booking.reportSharingStatus.consented).toBe(true);
    expect(booking.reportSharingStatus.shared).toBe(true);
    expect(booking.reportSharingStatus.secureAccessToken).toBeDefined();
    expect(booking.reportSharingStatus.tokenExpiresAt).toBeDefined();
    expect(booking.reportSharingStatus.auditLog).toContain('Patient explicitly consented via opt-in checkbox');
  });

  it('strictly respects patient refusal when consent checkbox is unchecked', () => {
    const booking = createAppointmentBooking({
      doctorId: SEEDED_DOCTORS[1].id,
      patientName: 'Pooja Iyer',
      patientPhone: '+91 98450 12345',
      appointmentDate: 'Friday',
      slotTime: '11:00 AM',
      shareReportConsent: false,
    });

    expect(booking.status).toBe('CONFIRMED_SIMULATED');
    expect(booking.reportSharingStatus.consented).toBe(false);
    expect(booking.reportSharingStatus.shared).toBe(false);
    expect(booking.reportSharingStatus.secureAccessToken).toBeUndefined();
    expect(booking.reportSharingStatus.auditLog).toContain('Patient did not authorize report sharing');
  });

  it('persists appointment to backend or graceful local fallback without throwing', async () => {
    const booking = createAppointmentBooking({
      doctorId: SEEDED_DOCTORS[0].id,
      patientName: 'Kavita Menon',
      patientPhone: '+91 99887 76655',
      appointmentDate: 'Thursday',
      slotTime: '02:00 PM',
      shareReportConsent: true,
      selectedReportName: 'Thyroid_Profile.pdf',
    });

    const res = await persistAppointment(booking);
    expect(res.persisted).toBe(true);
    expect(['supabase', 'local_fallback']).toContain(res.mode);
  });
});
