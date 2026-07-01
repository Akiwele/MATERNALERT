import { MOCK_CLINIC_APPOINTMENTS } from '@/constants/mock-clinic-data';
import type { ClinicAppointment } from '@/types/clinic-records';

let appointments: ClinicAppointment[] = [...MOCK_CLINIC_APPOINTMENTS];
let revision = 0;
const listeners = new Set<() => void>();

function emitChange() {
  revision += 1;
  listeners.forEach((listener) => listener());
}

export function getAncAppointmentsRevision(): number {
  return revision;
}

export function subscribeAncAppointments(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAncAppointments(): ClinicAppointment[] {
  return appointments;
}

export function setAncAppointments(nextAppointments: ClinicAppointment[]) {
  appointments = nextAppointments;
  emitChange();
}

export function updateAncAppointments(
  updater: (current: ClinicAppointment[]) => ClinicAppointment[],
) {
  appointments = updater(appointments);
  emitChange();
}

export function getAncAppointmentsForPhone(phoneNumber: string): ClinicAppointment[] {
  const normalizedPhone = phoneNumber.replace(/\D/g, '');

  return appointments.filter(
    (appointment) => appointment.phoneNumber.replace(/\D/g, '') === normalizedPhone,
  );
}

export function getAncAppointmentsForPatient(patientId: string): ClinicAppointment[] {
  return appointments.filter((appointment) => appointment.patientId === patientId);
}
