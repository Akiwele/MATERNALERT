export const EMERGENCY_CONTACT_RELATIONSHIPS = [
  'Mother',
  'Father',
  'Husband',
  'Wife',
  'Sister',
  'Brother',
  'Guardian',
  'Friend',
  'Other',
] as const;

export type EmergencyContactRelationship = (typeof EMERGENCY_CONTACT_RELATIONSHIPS)[number];
