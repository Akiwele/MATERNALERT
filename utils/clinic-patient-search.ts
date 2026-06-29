import type { CareNetworkPatient } from '@/types/clinic-patient';

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

export function searchCareNetworkPatients(
  patients: CareNetworkPatient[],
  query: string,
): CareNetworkPatient[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return patients;
  }

  const normalizedPhoneQuery = normalizePhone(query);

  return patients.filter((patient) => {
    const nameMatch = patient.fullName.toLowerCase().includes(normalizedQuery);
    const phoneMatch =
      normalizedPhoneQuery.length > 0 &&
      normalizePhone(patient.phoneNumber).includes(normalizedPhoneQuery);
    const ancBookMatch = patient.ancBookNumber
      ? patient.ancBookNumber.toLowerCase().includes(normalizedQuery)
      : false;

    return nameMatch || phoneMatch || ancBookMatch;
  });
}

export function clinicHasRecordAccess(
  patient: CareNetworkPatient,
  clinicName: string,
): boolean {
  return patient.consentGrantedClinicNames.includes(clinicName);
}
