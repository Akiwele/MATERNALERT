import {
  grantClinicAccessByPhone,
  upsertCareNetworkPatientFromAppData,
} from '@/stores/clinic-patient-registry';
import { getPatientRegistration } from '@/stores/patient-registration';
import { getPatientProfile } from '@/stores/patient-profile';

export function syncPatientToCareNetwork(): void {
  upsertCareNetworkPatientFromAppData(getPatientRegistration(), getPatientProfile());
}

export function transferPatientToClinic(clinicName: string): void {
  const registration = getPatientRegistration();

  if (!registration) {
    return;
  }

  grantClinicAccessByPhone(registration.phoneNumber, clinicName);
  syncPatientToCareNetwork();
}
