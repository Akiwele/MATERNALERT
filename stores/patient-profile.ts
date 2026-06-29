import { BloodGroup } from '@/constants/blood-groups';
import { EmergencyContactRelationship } from '@/constants/emergency-contact-relationships';
import { MedicalCondition } from '@/constants/medical-conditions';

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
  bloodGroup: BloodGroup | null;
  allergies: string;
  medicalConditions: MedicalCondition[];
  otherConditionDetails: string;
  riskStatus: string;
  ancBookNumber?: string;
};

let patientProfile: PatientProfile | null = null;

export function setPatientProfile(profile: PatientProfile) {
  patientProfile = profile;
}

export function updatePatientProfile(updates: Partial<PatientProfile>) {
  if (!patientProfile) {
    return null;
  }

  patientProfile = {
    ...patientProfile,
    ...updates,
  };

  return patientProfile;
}

export function getPatientProfile() {
  return patientProfile;
}

export function clearPatientProfile() {
  patientProfile = null;
}
