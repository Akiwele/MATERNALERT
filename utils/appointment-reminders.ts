import type { AntenatalAppointment } from '@/utils/appointments';
import { formatAppointmentDate, formatAppointmentTime, getAppointmentDateTime } from '@/utils/appointments';

export type AppointmentReminder = {
  id: string;
  title: string;
  message: string;
  tone: 'today' | 'tomorrow';
};

function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function isSameDay(left: Date, right: Date): boolean {
  return startOfDay(left).getTime() === startOfDay(right).getTime();
}

export function getAppointmentReminders(
  appointments: AntenatalAppointment[],
): AppointmentReminder[] {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return appointments
    .filter((appointment) => {
      const status = appointment.clinicalStatus;
      return status === 'scheduled' || status === 'reschedule_requested';
    })
    .map((appointment) => {
      const appointmentDate = getAppointmentDateTime(appointment);

      if (isSameDay(appointmentDate, today)) {
        return {
          id: `${appointment.id}-today`,
          title: 'Appointment today',
          message: `You have an ANC appointment today at ${formatAppointmentTime(appointment.appointmentTime)} with ${appointment.clinicName}.`,
          tone: 'today' as const,
        };
      }

      if (isSameDay(appointmentDate, tomorrow)) {
        return {
          id: `${appointment.id}-tomorrow`,
          title: 'Appointment tomorrow',
          message: `Reminder: ANC appointment tomorrow (${formatAppointmentDate(appointment.appointmentDate)}) at ${formatAppointmentTime(appointment.appointmentTime)}.`,
          tone: 'tomorrow' as const,
        };
      }

      return null;
    })
    .filter((reminder): reminder is AppointmentReminder => reminder !== null);
}
