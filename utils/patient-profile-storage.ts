import AsyncStorage from '@react-native-async-storage/async-storage';

// Local persistence layer. Replace save/load with Firebase when backend is connected.
import { STORAGE_KEYS } from '@/constants/storage-keys';
import type { PatientProfile } from '@/stores/patient-profile';
import { calculateBmi } from '@/utils/pregnancy-calculations';

type StoredPatientProfile = Omit<PatientProfile, 'dateOfBirth' | 'lmpDate'> & {
  dateOfBirth: string;
  lmpDate: string;
};

function serializePatientProfile(profile: PatientProfile): string {
  const stored: StoredPatientProfile = {
    ...profile,
    dateOfBirth: profile.dateOfBirth.toISOString(),
    lmpDate: profile.lmpDate.toISOString(),
  };

  return JSON.stringify(stored);
}

function parsePatientProfile(value: string | null): PatientProfile | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as StoredPatientProfile;
    const dateOfBirth = new Date(parsed.dateOfBirth);
    const lmpDate = new Date(parsed.lmpDate);

    if (Number.isNaN(dateOfBirth.getTime()) || Number.isNaN(lmpDate.getTime())) {
      return null;
    }

    return {
      ...parsed,
      dateOfBirth,
      lmpDate,
      bmi: calculateBmi(parsed.heightCm, parsed.weightKg),
    };
  } catch {
    return null;
  }
}

export async function loadPatientProfileFromStorage(): Promise<PatientProfile | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
  return parsePatientProfile(value);
}

export async function savePatientProfileToStorage(profile: PatientProfile | null): Promise<void> {
  if (!profile) {
    await AsyncStorage.removeItem(STORAGE_KEYS.PATIENT_PROFILE);
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, serializePatientProfile(profile));
}
