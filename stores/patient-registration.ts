import { Clinic } from '@/constants/clinics';

export type PendingPatientRegistration = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  clinic: Clinic;
};

export type PatientRegistration = PendingPatientRegistration & {
  agreedToTerms: true;
  agreedAt: Date;
};

let pendingRegistration: PendingPatientRegistration | null = null;
let patientRegistration: PatientRegistration | null = null;

export function setPendingPatientRegistration(data: PendingPatientRegistration) {
  pendingRegistration = data;
}

export function getPendingPatientRegistration() {
  return pendingRegistration;
}

export function clearPendingPatientRegistration() {
  pendingRegistration = null;
}

export function createPatientAccount(): PatientRegistration | null {
  if (!pendingRegistration) {
    return null;
  }

  patientRegistration = {
    ...pendingRegistration,
    agreedToTerms: true,
    agreedAt: new Date(),
  };

  pendingRegistration = null;
  return patientRegistration;
}

export function getPatientRegistration() {
  return patientRegistration;
}

export function updatePatientClinic(clinic: Clinic) {
  if (patientRegistration) {
    patientRegistration = {
      ...patientRegistration,
      clinic,
    };
  }
}

export function updatePatientRegistration(
  updates: Partial<Pick<PendingPatientRegistration, 'fullName' | 'phoneNumber' | 'email'>>,
) {
  if (!patientRegistration) {
    return null;
  }

  patientRegistration = {
    ...patientRegistration,
    ...updates,
  };

  return patientRegistration;
}

export function clearPatientRegistration() {
  patientRegistration = null;
}
