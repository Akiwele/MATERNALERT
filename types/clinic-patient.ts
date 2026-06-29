/**
 * Shared pregnancy record visible across verified clinics.
 * Identified by name, phone, and optional ANC book number — not a clinic-specific ID.
 */
export type CareNetworkPatient = {
  id: string;
  fullName: string;
  phoneNumber: string;
  ancBookNumber?: string;
  registeredClinicName: string;
  currentWeek?: number;
  riskStatus?: string;
  consentGrantedClinicNames: string[];
};
