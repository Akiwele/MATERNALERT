export const MEDICAL_CONDITIONS = [
  'None',
  'Hypertension',
  'Diabetes',
  'Asthma',
  'Sickle Cell Disease',
  'Heart Disease',
  'HIV/AIDS',
  'Epilepsy',
  'Other',
] as const;

export type MedicalCondition = (typeof MEDICAL_CONDITIONS)[number];

export function getRiskStatusFromConditions(conditions: MedicalCondition[]): string {
  if (conditions.includes('None') && conditions.length === 1) {
    return 'Low Risk';
  }

  if (conditions.some((condition) => condition !== 'None')) {
    return 'High Risk';
  }

  return 'Low Risk';
}
