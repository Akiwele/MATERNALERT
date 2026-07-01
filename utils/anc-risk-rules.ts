import type { ClinicAppointment, RiskLevel } from '@/types/clinic-records';

export const MISSED_ONE_ANC_WARNING =
  'You missed your last ANC appointment. Please contact your clinic.';

export const MISSED_TWO_CONSECUTIVE_REASON = 'Missed 2 consecutive ANC appointments.';

function isAncVisit(visitType: ClinicAppointment['visitType']): boolean {
  return visitType === 'Routine ANC Visit' || visitType === 'Follow-up Visit';
}

export function countConsecutiveMissedAncAppointments(
  appointments: ClinicAppointment[],
): number {
  const sorted = [...appointments]
    .filter((appointment) => isAncVisit(appointment.visitType))
    .sort((left, right) => right.date.getTime() - left.date.getTime());

  let consecutiveMissed = 0;

  for (const appointment of sorted) {
    if (appointment.status === 'missed') {
      consecutiveMissed += 1;
      continue;
    }

    if (appointment.status === 'attended') {
      break;
    }
  }

  return consecutiveMissed;
}

export function applyMissedAncRiskReasons(existingReasons: string[]): string[] {
  const withoutMissedReasons = existingReasons.filter(
    (reason) =>
      reason !== 'Missed ANC visit' &&
      reason !== MISSED_TWO_CONSECUTIVE_REASON &&
      reason !== 'Missed 2 ANC visits',
  );

  return withoutMissedReasons;
}

export function getMissedAncRiskReasons(
  appointments: ClinicAppointment[],
  existingReasons: string[],
): string[] {
  const consecutiveMissed = countConsecutiveMissedAncAppointments(appointments);
  const nextReasons = applyMissedAncRiskReasons(existingReasons);

  if (consecutiveMissed >= 2) {
    return [...nextReasons, MISSED_TWO_CONSECUTIVE_REASON];
  }

  return nextReasons;
}

export function deriveRiskStatusFromReasons(reasons: string[]): RiskLevel {
  return reasons.length > 0 ? 'High Risk' : 'Low Risk';
}

export function getPatientMissedAncWarning(
  appointments: ClinicAppointment[],
): string | null {
  const consecutiveMissed = countConsecutiveMissedAncAppointments(appointments);

  if (consecutiveMissed === 1) {
    return MISSED_ONE_ANC_WARNING;
  }

  return null;
}
