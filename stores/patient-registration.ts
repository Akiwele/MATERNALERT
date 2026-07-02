import { Clinic } from '@/constants/clinics';
import {
  loadPatientRegistrationFromStorage,
  savePatientRegistrationToStorage,
} from '@/utils/patient-registration-storage';

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

type PatientRegistrationListener = () => void;

let pendingRegistration: PendingPatientRegistration | null = null;
let patientRegistration: PatientRegistration | null = null;
let patientRegistrationRevision = 0;
const listeners = new Set<PatientRegistrationListener>();

function notifyPatientRegistrationListeners() {
  patientRegistrationRevision += 1;
  listeners.forEach((listener) => listener());
}

function persistPatientRegistration() {
  return savePatientRegistrationToStorage(patientRegistration);
}

export function subscribePatientRegistration(listener: PatientRegistrationListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPatientRegistrationRevision() {
  return patientRegistrationRevision;
}

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
  notifyPatientRegistrationListeners();
  void persistPatientRegistration();

  return patientRegistration;
}

export function getPatientRegistration() {
  return patientRegistration;
}

export function updatePatientClinic(clinic: Clinic) {
  if (!patientRegistration) {
    return;
  }

  patientRegistration = {
    ...patientRegistration,
    clinic,
  };

  notifyPatientRegistrationListeners();
  void persistPatientRegistration();
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

  notifyPatientRegistrationListeners();
  void persistPatientRegistration();

  return patientRegistration;
}

export async function updatePatientRegistrationAsync(
  updates: Partial<Pick<PendingPatientRegistration, 'fullName' | 'phoneNumber' | 'email'>>,
) {
  const updated = updatePatientRegistration(updates);

  if (!updated) {
    return null;
  }

  await persistPatientRegistration();
  return updated;
}

export function clearPatientRegistration() {
  patientRegistration = null;
  notifyPatientRegistrationListeners();
  void savePatientRegistrationToStorage(null);
}

export async function hydratePatientRegistration() {
  const storedRegistration = await loadPatientRegistrationFromStorage();

  if (storedRegistration) {
    patientRegistration = storedRegistration;
    notifyPatientRegistrationListeners();
  }
}
