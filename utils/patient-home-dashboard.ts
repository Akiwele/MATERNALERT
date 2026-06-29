import { getPatientRegistration } from '@/stores/patient-registration';
import type { HealthRecord } from '@/types/health';
import type { AntenatalAppointment } from '@/utils/appointments';
import { formatAppointmentTime } from '@/utils/appointments';

export type BpTrendPoint = {
  week: number;
  sys: number;
  dia: number;
};

export type WeightTrendPoint = {
  index: number;
  weightKg: number;
};

export type CheckInStats = {
  streak: number;
  total: number;
};

export type AppointmentDayDisplay = {
  day: string;
  month: string;
  time: string;
  label: string;
  provider: string;
  location: string;
};

export function getPatientFullName(): string {
  const registration = getPatientRegistration();
  return registration?.fullName ?? 'Stacy';
}

export function getPatientInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function hasBpAlert(systolic: number | null, diastolic: number | null): boolean {
  if (systolic === null || diastolic === null) {
    return false;
  }

  return systolic >= 130 || diastolic >= 90;
}

export function getBpTrendData(records: HealthRecord[]): BpTrendPoint[] {
  return records
    .filter((record) => record.systolic !== undefined && record.diastolic !== undefined)
    .sort(
      (left, right) =>
        new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime(),
    )
    .slice(-6)
    .map((record, index) => ({
      week: index + 1,
      sys: record.systolic!,
      dia: record.diastolic!,
    }));
}

export function getWeightTrendData(records: HealthRecord[]): WeightTrendPoint[] {
  return records
    .filter((record) => record.weightKg !== undefined)
    .sort(
      (left, right) =>
        new Date(left.recordedAt).getTime() - new Date(right.recordedAt).getTime(),
    )
    .slice(-6)
    .map((record, index) => ({
      index: index + 1,
      weightKg: record.weightKg!,
    }));
}

export function getCheckInStats(records: HealthRecord[]): CheckInStats {
  const submitted = records.filter(
    (record) =>
      record.systolic !== undefined ||
      record.diastolic !== undefined ||
      record.weightKg !== undefined,
  );

  return {
    streak: submitted.length,
    total: submitted.length,
  };
}

export function formatAppointmentDayDisplay(
  appointment: AntenatalAppointment,
): AppointmentDayDisplay {
  const date = new Date(appointment.appointmentDate);

  return {
    day: String(date.getDate()),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    time: formatAppointmentTime(appointment.appointmentTime),
    label: appointment.appointmentType,
    provider: appointment.clinicName,
    location: appointment.clinicName,
  };
}
