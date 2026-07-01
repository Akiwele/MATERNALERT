export const HEALTH_SYMPTOMS = [
  'None',
  'Headache',
  'Dizziness',
  'Swollen Feet',
  'Blurred Vision',
  'Fever',
  'Vomiting',
  'Bleeding',
  'Severe Abdominal Pain',
  'Reduced Baby Movement',
  'Other',
] as const;

export type HealthSymptom = (typeof HEALTH_SYMPTOMS)[number];

export function isSymptomChipDisabled(
  selectedSymptoms: string[],
  symptom: HealthSymptom,
): boolean {
  return selectedSymptoms.includes('None') && symptom !== 'None';
}

export function toggleHealthSymptom(
  selectedSymptoms: string[],
  symptom: HealthSymptom,
): string[] {
  if (symptom === 'None') {
    if (selectedSymptoms.includes('None')) {
      return selectedSymptoms.filter((item) => item !== 'None');
    }

    return ['None'];
  }

  const withoutNone = selectedSymptoms.filter((item) => item !== 'None');

  if (withoutNone.includes(symptom)) {
    return withoutNone.filter((item) => item !== symptom);
  }

  return [...withoutNone, symptom];
}

export function normalizeSymptomsForSave(selectedSymptoms: string[]): string[] {
  if (selectedSymptoms.includes('None')) {
    return ['None'];
  }

  return selectedSymptoms.filter((item) => item !== 'None');
}
