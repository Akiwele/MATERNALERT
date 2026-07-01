import { MOCK_CLINIC_SESSION } from '@/constants/clinic-session';
import {
  getAncAppointmentsForPhone,
  getAncAppointmentsRevision,
} from '@/stores/anc-appointments-store';
import { getPatientRegistration } from '@/stores/patient-registration';
import type { ClinicAppointment } from '@/types/clinic-records';
import type { AntenatalAppointment } from '@/utils/appointments';

const DEMO_PATIENT_PHONE = '0244123456';

let cachedRevision = -1;
let cachedPhone = '';
let cachedSnapshot: AntenatalAppointment[] = [];

export function getPatientPhoneForAppointments(): string {
  return getPatientRegistration()?.phoneNumber ?? DEMO_PATIENT_PHONE;
}

export function getPatientClinicNameForAppointments(): string {
  return getPatientRegistration()?.clinic.name ?? MOCK_CLINIC_SESSION.name;
}

export function mapClinicAppointmentToPatientView(
  appointment: ClinicAppointment,
  clinicName: string,
): AntenatalAppointment {
  return {
    id: appointment.id,
    clinicName,
    appointmentDate: appointment.date.toISOString(),
    appointmentTime: appointment.time.toISOString(),
    appointmentType: appointment.visitType,
    notes: appointment.notes,
    clinicalStatus: appointment.status,
  };
}

export function getPatientAppointmentsFromStore(): AntenatalAppointment[] {
  const phoneNumber = getPatientPhoneForAppointments();
  const storeRevision = getAncAppointmentsRevision();

  if (storeRevision === cachedRevision && phoneNumber === cachedPhone) {
    return cachedSnapshot;
  }

  const clinicName = getPatientClinicNameForAppointments();
  cachedRevision = storeRevision;
  cachedPhone = phoneNumber;
  cachedSnapshot = getAncAppointmentsForPhone(phoneNumber).map((appointment) =>
    mapClinicAppointmentToPatientView(appointment, clinicName),
  );

  return cachedSnapshot;
}
