import AsyncStorage from '@react-native-async-storage/async-storage';

// Local persistence layer. Replace save/load with Firebase when backend is connected.
import { STORAGE_KEYS } from '@/constants/storage-keys';
import type { PatientRegistration } from '@/stores/patient-registration';

type StoredPatientRegistration = Omit<PatientRegistration, 'agreedAt'> & {
  agreedAt: string;
};

function serializePatientRegistration(registration: PatientRegistration): string {
  const stored: StoredPatientRegistration = {
    ...registration,
    agreedAt: registration.agreedAt.toISOString(),
  };

  return JSON.stringify(stored);
}

function parsePatientRegistration(value: string | null): PatientRegistration | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as StoredPatientRegistration;
    const agreedAt = new Date(parsed.agreedAt);

    if (
      !parsed.fullName ||
      !parsed.phoneNumber ||
      !parsed.email ||
      !parsed.clinic?.name ||
      Number.isNaN(agreedAt.getTime())
    ) {
      return null;
    }

    return {
      ...parsed,
      agreedAt,
      agreedToTerms: true,
    };
  } catch {
    return null;
  }
}

export async function loadPatientRegistrationFromStorage(): Promise<PatientRegistration | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.PATIENT_REGISTRATION);
  return parsePatientRegistration(value);
}

export async function savePatientRegistrationToStorage(
  registration: PatientRegistration | null,
): Promise<void> {
  if (!registration) {
    await AsyncStorage.removeItem(STORAGE_KEYS.PATIENT_REGISTRATION);
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEYS.PATIENT_REGISTRATION, serializePatientRegistration(registration));
}
