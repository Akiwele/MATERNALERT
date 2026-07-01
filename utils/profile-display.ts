import type { MedicalCondition } from '@/constants/medical-conditions';
import type { PatientProfile } from '@/stores/patient-profile';
import { formatDisplayDate } from '@/utils/pregnancy-calculations';

const EMPTY_PROFILE_DISPLAY_VALUES = new Set(['', 'Not provided', 'None recorded']);

export function isEmptyProfileDisplayValue(value?: string | null): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  return EMPTY_PROFILE_DISPLAY_VALUES.has(value.trim());
}

export function formatProfileValue(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') {
    return 'Not provided';
  }

  return String(value);
}

export function formatProfileFieldValue(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  const formatted = String(value).trim();
  return isEmptyProfileDisplayValue(formatted) ? '' : formatted;
}

export function formatYesNo(value?: boolean | null): string {
  if (value === null || value === undefined) {
    return 'Not provided';
  }

  return value ? 'Yes' : 'No';
}

export function formatYesNoDisplay(value?: boolean | null): string {
  if (value === null || value === undefined) {
    return '';
  }

  return value ? 'Yes' : 'No';
}

export function buildMedicalConditionDisplayLabels(
  conditions: MedicalCondition[],
  otherConditionDetails = '',
): string[] {
  if (conditions.includes('None') && conditions.length === 1) {
    return ['None'];
  }

  const labels: string[] = conditions
    .filter((condition) => condition !== 'None' && condition !== 'Other')
    .map((condition) => condition);

  if (conditions.includes('Other')) {
    const details = otherConditionDetails.trim();
    labels.push(details ? `Other - ${details}` : 'Other');
  }

  return labels;
}

export function formatMedicalConditionsList(
  conditions: MedicalCondition[],
  otherConditionDetails = '',
): string {
  return buildMedicalConditionDisplayLabels(conditions, otherConditionDetails).join(', ');
}

export function formatMedicalConditions(profile: PatientProfile | null): string {
  if (!profile || profile.medicalConditions.length === 0) {
    return 'Not provided';
  }

  return formatMedicalConditionsList(profile.medicalConditions, profile.otherConditionDetails);
}

export function formatMedicalConditionsDisplay(profile: PatientProfile | null): string {
  if (!profile || profile.medicalConditions.length === 0) {
    return '';
  }

  return formatMedicalConditions(profile);
}

export function formatDateOfBirth(date?: Date | null): string {
  if (!date) {
    return 'Not provided';
  }

  return formatDisplayDate(date);
}

export function formatDateOfBirthDisplay(date?: Date | null): string {
  if (!date) {
    return '';
  }

  return formatDisplayDate(date);
}

export function formatObstetricValue(
  profile: PatientProfile | null,
  field: keyof NonNullable<PatientProfile['obstetricHistory']>,
): string {
  if (!profile) {
    return 'Not provided';
  }

  if (profile.isFirstPregnancy) {
    return 'N/A';
  }

  const value = profile.obstetricHistory?.[field];
  return formatProfileValue(value);
}

export function formatObstetricValueDisplay(
  profile: PatientProfile | null,
  field: keyof NonNullable<PatientProfile['obstetricHistory']>,
): string {
  if (!profile) {
    return '';
  }

  if (profile.isFirstPregnancy) {
    return 'N/A';
  }

  const value = profile.obstetricHistory?.[field];
  return formatProfileFieldValue(value);
}
