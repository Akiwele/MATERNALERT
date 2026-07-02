/**
 * Shared pregnancy record visible across verified clinics.
 * Identified by name, phone, and email — not a clinic-specific ID.
 */
export type CareNetworkPatient = {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  registeredClinicName: string;
  currentWeek?: number;
  riskStatus?: string;
  consentGrantedClinicNames: string[];
};
