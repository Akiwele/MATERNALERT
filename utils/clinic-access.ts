import { MOCK_CLINIC_SESSION } from '@/constants/clinic-session';

export const CLINIC_SESSION = MOCK_CLINIC_SESSION;

export function clinicHasPatientAccess(
  consentGrantedClinicNames: string[],
  clinicName: string = CLINIC_SESSION.name,
): boolean {
  return consentGrantedClinicNames.includes(clinicName);
}
