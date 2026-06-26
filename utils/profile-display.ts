import type { PatientProfile } from '@/stores/patient-profile';
import { formatDisplayDate } from '@/utils/pregnancy-calculations';

export function formatProfileValue(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') {
    return 'Not provided';
  }

  return String(value);
}

export function formatYesNo(value?: boolean | null): string {
  if (value === null || value === undefined) {
    return 'Not provided';
  }

  return value ? 'Yes' : 'No';
}

export function formatMedicalConditions(profile: PatientProfile | null): string {
  if (!profile || profile.medicalConditions.length === 0) {
    return 'Not provided';
  }

  if (profile.medicalConditions.includes('None') && profile.medicalConditions.length === 1) {
    return 'None';
  }

  const labels: string[] = profile.medicalConditions
    .filter((condition) => condition !== 'Other')
    .map((condition) => condition);

  if (profile.medicalConditions.includes('Other') && profile.otherConditionDetails.trim()) {
    labels.push(`Other (${profile.otherConditionDetails.trim()})`);
  } else if (profile.medicalConditions.includes('Other')) {
    labels.push('Other');
  }

  return labels.join(', ');
}

export function formatDateOfBirth(date?: Date | null): string {
  if (!date) {
    return 'Not provided';
  }

  return formatDisplayDate(date);
}

export function formatObstetricValue(profile: PatientProfile | null, field: keyof NonNullable<PatientProfile['obstetricHistory']>): string {
  if (!profile) {
    return 'Not provided';
  }

  if (profile.isFirstPregnancy) {
    return 'N/A';
  }

  const value = profile.obstetricHistory?.[field];
  return formatProfileValue(value);
}
