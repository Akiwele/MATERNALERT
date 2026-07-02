import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getPatientProfile,
  hydratePatientProfile,
  subscribePatientProfile,
  type PatientProfile,
} from '@/stores/patient-profile';
import {
  getPatientRegistration,
  hydratePatientRegistration,
  subscribePatientRegistration,
  type PatientRegistration,
} from '@/stores/patient-registration';

function snapshotProfile(profile: PatientProfile | null) {
  if (!profile) {
    return null;
  }

  return {
    ...profile,
    dateOfBirth: new Date(profile.dateOfBirth),
    lmpDate: new Date(profile.lmpDate),
    emergencyContact: profile.emergencyContact ? { ...profile.emergencyContact } : null,
    obstetricHistory: profile.obstetricHistory ? { ...profile.obstetricHistory } : null,
    medicalConditions: [...profile.medicalConditions],
  };
}

function snapshotRegistration(registration: PatientRegistration | null) {
  if (!registration) {
    return null;
  }

  return {
    ...registration,
    agreedAt: new Date(registration.agreedAt),
    clinic: { ...registration.clinic },
  };
}

type PatientDataContextValue = {
  profile: PatientProfile | null;
  registration: PatientRegistration | null;
  isHydrated: boolean;
};

const PatientDataContext = createContext<PatientDataContextValue | null>(null);

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(() => snapshotProfile(getPatientProfile()));
  const [registration, setRegistration] = useState(() =>
    snapshotRegistration(getPatientRegistration()),
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      await Promise.all([hydratePatientProfile(), hydratePatientRegistration()]);

      if (!isMounted) {
        return;
      }

      setProfile(snapshotProfile(getPatientProfile()));
      setRegistration(snapshotRegistration(getPatientRegistration()));
      setIsHydrated(true);
    }

    void hydrate();

    const unsubscribeProfile = subscribePatientProfile(() => {
      setProfile(snapshotProfile(getPatientProfile()));
    });
    const unsubscribeRegistration = subscribePatientRegistration(() => {
      setRegistration(snapshotRegistration(getPatientRegistration()));
    });

    return () => {
      isMounted = false;
      unsubscribeProfile();
      unsubscribeRegistration();
    };
  }, []);

  const value = useMemo(
    () => ({
      profile,
      registration,
      isHydrated,
    }),
    [profile, registration, isHydrated],
  );

  return <PatientDataContext.Provider value={value}>{children}</PatientDataContext.Provider>;
}

export function usePatientData() {
  const context = useContext(PatientDataContext);

  if (!context) {
    throw new Error('usePatientData must be used within a PatientDataProvider');
  }

  return context;
}
