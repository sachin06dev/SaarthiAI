export interface DoctorProfile {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  clinicName: string;
  location: string;
  consultationFee: string;
  availableDays: string[];
  slots: string[];
  partnerType: 'SIMULATED_DEMO_PARTNER' | 'VERIFIED_CLINIC';
  avatarInitials: string;
}

export interface AppointmentBookingRequest {
  doctorId: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  slotTime: string;
  patientNotes?: string;
  shareReportConsent: boolean;
  selectedReportId?: string;
  selectedReportName?: string;
}

export interface AppointmentConfirmation {
  bookingId: string;
  status: 'CONFIRMED_SIMULATED' | 'CONFIRMED_REAL';
  doctor: DoctorProfile;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  slotTime: string;
  bookedAt: string;
  reportSharingStatus: {
    consented: boolean;
    shared: boolean;
    reportName?: string;
    secureAccessToken?: string;
    tokenExpiresAt?: string;
    auditLog: string;
  };
}

export const SEEDED_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc_vikram_sen',
    name: 'Dr. Vikram Sen',
    qualification: 'MBBS, MD (General Medicine)',
    specialty: 'Internal Medicine',
    experienceYears: 14,
    clinicName: 'Max Healthcare Centre',
    location: 'Indiranagar, Bengaluru',
    consultationFee: '₹800',
    availableDays: ['Today', 'Tomorrow', 'Thursday'],
    slots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
    partnerType: 'SIMULATED_DEMO_PARTNER',
    avatarInitials: 'VS',
  },
  {
    id: 'doc_meenakshi_s',
    name: 'Dr. Meenakshi Sundaram',
    qualification: 'MBBS, MD, DM (Endocrinology)',
    specialty: 'Diabetes & Endocrinology',
    experienceYears: 18,
    clinicName: 'Apollo Specialty Clinics',
    location: 'HSR Layout, Bengaluru',
    consultationFee: '₹1,000',
    availableDays: ['Today', 'Tomorrow', 'Friday'],
    slots: ['09:30 AM', '11:00 AM', '03:15 PM', '05:00 PM'],
    partnerType: 'SIMULATED_DEMO_PARTNER',
    avatarInitials: 'MS',
  },
  {
    id: 'doc_priya_nair',
    name: 'Dr. Priya Nair',
    qualification: 'MBBS, MD (Pathology & Hematology)',
    specialty: 'Clinical Hematology',
    experienceYears: 12,
    clinicName: 'Manipal Medical Annexe',
    location: 'Whitefield, Bengaluru',
    consultationFee: '₹850',
    availableDays: ['Tomorrow', 'Thursday', 'Saturday'],
    slots: ['10:30 AM', '01:00 PM', '03:30 PM', '06:00 PM'],
    partnerType: 'SIMULATED_DEMO_PARTNER',
    avatarInitials: 'PN',
  },
  {
    id: 'doc_amitav_ghosh',
    name: 'Dr. Amitav Ghosh',
    qualification: 'MBBS, MD, DM (Nephrology)',
    specialty: 'Nephrology & Renal Care',
    experienceYears: 16,
    clinicName: 'Fortis Healthcare Hub',
    location: 'Bannerghatta, Bengaluru',
    consultationFee: '₹950',
    availableDays: ['Today', 'Thursday', 'Friday'],
    slots: ['11:15 AM', '02:30 PM', '04:00 PM', '05:45 PM'],
    partnerType: 'SIMULATED_DEMO_PARTNER',
    avatarInitials: 'AG',
  },
];

/**
 * Creates an appointment with explicit patient consent validation and time-limited token generation.
 */
export function createAppointmentBooking(
  request: AppointmentBookingRequest
): AppointmentConfirmation {
  const doctor = SEEDED_DOCTORS.find((d) => d.id === request.doctorId) || SEEDED_DOCTORS[0];

  const bookingId = `SAARTHI-APT-${Math.floor(100000 + Math.random() * 900000)}`;
  const bookedAt = new Date().toISOString();

  // Expiration: 48 hours from appointment booking
  const expirationDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  let reportSharingStatus: AppointmentConfirmation['reportSharingStatus'] = {
    consented: false,
    shared: false,
    auditLog: 'Patient did not authorize report sharing. Consultation booked without prior report access.',
  };

  if (request.shareReportConsent) {
    reportSharingStatus = {
      consented: true,
      shared: true,
      reportName: request.selectedReportName || 'Active Verified Laboratory Report',
      secureAccessToken: `saarthi_doc_token_${Math.random().toString(36).substring(2, 12)}`,
      tokenExpiresAt: expirationDate,
      auditLog: `Patient explicitly consented via opt-in checkbox to share verified report "${
        request.selectedReportName || 'Active Report'
      }" with ${doctor.name} for appointment ${bookingId}. Access is time-limited (48h expiry) and logged.`,
    };
  }

  return {
    bookingId,
    status: 'CONFIRMED_SIMULATED',
    doctor,
    patientName: request.patientName,
    patientPhone: request.patientPhone,
    appointmentDate: request.appointmentDate,
    slotTime: request.slotTime,
    bookedAt,
    reportSharingStatus,
  };
}
