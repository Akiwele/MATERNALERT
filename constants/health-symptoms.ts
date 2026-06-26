export const HEALTH_SYMPTOMS = [
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
