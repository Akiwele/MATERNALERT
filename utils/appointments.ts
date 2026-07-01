import type { AppointmentType } from '@/constants/appointment-types';
import type { ClinicAppointmentStatus } from '@/types/clinic-records';

export type AppointmentStatus =
  | 'upcoming'
  | 'missed'
  | 'completed'
  | 'reschedule_requested';

export type AntenatalAppointment = {
  id: string;
  clinicName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: AppointmentType;
  notes?: string;
  clinicalStatus: ClinicAppointmentStatus;
};

function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function getAppointmentDateTime(appointment: AntenatalAppointment): Date {
  const date = new Date(appointment.appointmentDate);
  const time = new Date(appointment.appointmentTime);
  date.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return date;
}

export function getAppointmentStatus(appointment: AntenatalAppointment): AppointmentStatus {
  if (appointment.clinicalStatus === 'attended') {
    return 'completed';
  }

  if (appointment.clinicalStatus === 'missed') {
    return 'missed';
  }

  if (appointment.clinicalStatus === 'reschedule_requested') {
    return 'reschedule_requested';
  }

  const today = startOfDay(new Date());
  const appointmentDay = startOfDay(new Date(appointment.appointmentDate));

  if (appointmentDay < today) {
    return 'missed';
  }

  return 'upcoming';
}

export function sortAppointmentsByDate(
  appointments: AntenatalAppointment[],
): AntenatalAppointment[] {
  return [...appointments].sort(
    (left, right) =>
      getAppointmentDateTime(left).getTime() - getAppointmentDateTime(right).getTime(),
  );
}

export function getNextUpcomingAppointment(
  appointments: AntenatalAppointment[],
): AntenatalAppointment | null {
  const today = startOfDay(new Date());

  return (
    sortAppointmentsByDate(appointments).find((appointment) => {
      const status = getAppointmentStatus(appointment);

      if (status !== 'upcoming' && status !== 'reschedule_requested') {
        return false;
      }

      const appointmentDay = startOfDay(new Date(appointment.appointmentDate));
      return appointmentDay >= today;
    }) ?? null
  );
}

export function formatAppointmentDate(dateValue: string): string {
  return new Date(dateValue).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatAppointmentTime(timeValue: string): string {
  return new Date(timeValue).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
