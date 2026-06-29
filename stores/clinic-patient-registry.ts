import type { PatientRegistration } from '@/stores/patient-registration';
import type { PatientProfile } from '@/stores/patient-profile';
import type { CareNetworkPatient } from '@/types/clinic-patient';
import { calculatePregnancyMetrics } from '@/utils/pregnancy-calculations';

import { MOCK_CARE_NETWORK_PATIENTS } from '@/constants/mock-clinic-patients';

let careNetworkPatients: CareNetworkPatient[] = [...MOCK_CARE_NETWORK_PATIENTS];

function buildRecordId(phoneNumber: string): string {
  return `rec-${phoneNumber.replace(/\D/g, '')}`;
}

export function getCareNetworkPatients(): CareNetworkPatient[] {
  return careNetworkPatients;
}

export function upsertCareNetworkPatientFromAppData(
  registration: PatientRegistration | null,
  profile: PatientProfile | null,
): void {
  if (!registration) {
    return;
  }

  const recordId = buildRecordId(registration.phoneNumber);
  const metrics = profile ? calculatePregnancyMetrics(profile.lmpDate) : null;
  const existing = careNetworkPatients.find((patient) => patient.id === recordId);
  const registeredClinicName = registration.clinic.name;

  const nextRecord: CareNetworkPatient = {
    id: recordId,
    fullName: registration.fullName,
    phoneNumber: registration.phoneNumber,
    ancBookNumber: profile?.ancBookNumber?.trim() || undefined,
    registeredClinicName,
    currentWeek: metrics?.weeks,
    riskStatus: profile?.riskStatus,
    consentGrantedClinicNames: existing?.consentGrantedClinicNames.includes(registeredClinicName)
      ? existing.consentGrantedClinicNames
      : [...(existing?.consentGrantedClinicNames ?? []), registeredClinicName],
  };

  if (existing) {
    careNetworkPatients = careNetworkPatients.map((patient) =>
      patient.id === recordId ? nextRecord : patient,
    );
    return;
  }

  careNetworkPatients = [nextRecord, ...careNetworkPatients];
}

export function grantClinicAccessToPatient(patientId: string, clinicName: string): void {
  careNetworkPatients = careNetworkPatients.map((patient) => {
    if (patient.id !== patientId) {
      return patient;
    }

    if (patient.consentGrantedClinicNames.includes(clinicName)) {
      return patient;
    }

    return {
      ...patient,
      consentGrantedClinicNames: [...patient.consentGrantedClinicNames, clinicName],
    };
  });
}

export function grantClinicAccessByPhone(phoneNumber: string, clinicName: string): void {
  grantClinicAccessToPatient(buildRecordId(phoneNumber), clinicName);
}
