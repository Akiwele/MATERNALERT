import { BloodGroup } from '@/constants/blood-groups';
import { EmergencyContactRelationship } from '@/constants/emergency-contact-relationships';
import { MedicalCondition } from '@/constants/medical-conditions';
import { calculateBmi } from '@/utils/pregnancy-calculations';
import {
  loadPatientProfileFromStorage,
  savePatientProfileToStorage,
} from '@/utils/patient-profile-storage';

export type ObstetricHistory = {
  previousPregnancies: number;
  livingChildren: number;
  previousMiscarriages: number;
  previousInducedAbortions: number;
  previousStillbirths?: number;
};

export type EmergencyContact = {
  phoneNumber: string;
  name: string;
  relationship: EmergencyContactRelationship;
};

export type PatientProfile = {
  dateOfBirth: Date;
  emergencyContact: EmergencyContact | null;
  lmpDate: Date;
  isFirstPregnancy: boolean;
  obstetricHistory: ObstetricHistory | null;
  heightCm: number;
  weightKg: number;
  bmi: number | null;
  bloodGroup: BloodGroup | null;
  allergies: string;
  medicalConditions: MedicalCondition[];
  otherConditionDetails: string;
  riskStatus: string;
};

type PatientProfileListener = () => void;

let patientProfile: PatientProfile | null = null;
let patientProfileRevision = 0;
const listeners = new Set<PatientProfileListener>();

function withComputedBmi<T extends Omit<PatientProfile, 'bmi'>>(profile: T): T & { bmi: number | null } {
  return {
    ...profile,
    bmi: calculateBmi(profile.heightCm, profile.weightKg),
  };
}

function notifyPatientProfileListeners() {
  patientProfileRevision += 1;
  listeners.forEach((listener) => listener());
}

function persistPatientProfile() {
  return savePatientProfileToStorage(patientProfile);
}

export function subscribePatientProfile(listener: PatientProfileListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPatientProfileRevision() {
  return patientProfileRevision;
}

export function setPatientProfile(profile: Omit<PatientProfile, 'bmi'>) {
  patientProfile = withComputedBmi(profile);
  notifyPatientProfileListeners();
  void persistPatientProfile();
}

export async function setPatientProfileAsync(profile: Omit<PatientProfile, 'bmi'>) {
  patientProfile = withComputedBmi(profile);
  notifyPatientProfileListeners();
  await persistPatientProfile();
  return patientProfile;
}

export function updatePatientProfile(updates: Partial<PatientProfile>) {
  if (!patientProfile) {
    return null;
  }

  patientProfile = withComputedBmi({
    ...patientProfile,
    ...updates,
  });

  notifyPatientProfileListeners();
  void persistPatientProfile();

  return patientProfile;
}

export async function updatePatientProfileAsync(updates: Partial<PatientProfile>) {
  const updated = updatePatientProfile(updates);

  if (!updated) {
    return null;
  }

  await persistPatientProfile();
  return updated;
}

export function getPatientProfile() {
  return patientProfile;
}

export function clearPatientProfile() {
  patientProfile = null;
  notifyPatientProfileListeners();
  void savePatientProfileToStorage(null);
}

export async function hydratePatientProfile() {
  const storedProfile = await loadPatientProfileFromStorage();

  if (storedProfile) {
    patientProfile = withComputedBmi(storedProfile);
    notifyPatientProfileListeners();
  }
}
