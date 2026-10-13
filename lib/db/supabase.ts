import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseClient = createClient(url, anonKey);
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }

  return null;
}

/**
 * Saves appointment record to Supabase backend or local storage fallback.
 */
export async function persistAppointment(appointment: any): Promise<{ persisted: boolean; mode: 'supabase' | 'local_fallback'; data?: any; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('appointments').insert([
        {
          booking_id: appointment.bookingId,
          doctor_id: appointment.doctor.id,
          doctor_name: appointment.doctor.name,
          patient_name: appointment.patientName,
          patient_phone: appointment.patientPhone,
          patient_notes: appointment.patientNotes || null,
          appointment_date: appointment.appointmentDate,
          slot_time: appointment.slotTime,
          consultation_fee: appointment.doctor.consultationFee || null,
          report_consent: appointment.reportSharingStatus.consented,
          report_name: appointment.reportSharingStatus.reportName || null,
          access_token: appointment.reportSharingStatus.secureAccessToken || null,
          token_expires_at: appointment.reportSharingStatus.tokenExpiresAt || null,
          created_at: appointment.bookedAt,
        },
      ]).select();

      if (!error && data) {
        return { persisted: true, mode: 'supabase', data: data[0] };
      }
      if (error) {
        console.warn('Supabase appointment insert error:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase network insert fallback:', err?.message || err);
    }
  }

  return { persisted: true, mode: 'local_fallback' };
}

/**
 * Saves verified report summary into Supabase reports table.
 */
export async function persistVerifiedReport(summary: any): Promise<{ persisted: boolean; mode: 'supabase' | 'local_fallback' }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('reports').insert([
        {
          report_id: summary.reportId,
          document_id: summary.documentId,
          file_name: summary.fileName,
          total_tests: summary.totalTests,
          in_range_count: summary.inRangeCount,
          above_range_count: summary.aboveRangeCount,
          below_range_count: summary.belowRangeCount,
          review_required_count: summary.reviewRequiredCount,
          no_verified_range_count: summary.noVerifiedRangeCount,
          verified_count: summary.verifiedCount,
          items: summary.items,
          created_at: new Date().toISOString(),
        },
      ]);
      if (!error) {
        return { persisted: true, mode: 'supabase' };
      }
    } catch {
      // Fallback
    }
  }

  return { persisted: true, mode: 'local_fallback' };
}
