export const APPOINTMENT_TYPES = [
  'Routine ANC Visit',
  'Lab Test',
  'Ultrasound Scan',
  'Follow-up Visit',
  'Emergency Review',
  'Other',
] as const;

export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];
