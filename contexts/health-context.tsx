import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getPatientProfile } from '@/stores/patient-profile';
import type {
  HealthRecord,
  HealthSummary,
  Medication,
  SaveBloodPressureInput,
  SaveMedicationInput,
  SaveSymptomsInput,
  SaveWeightInput,
} from '@/types/health';
import { computeHealthSummary } from '@/utils/health-display';

type HealthContextValue = {
  records: HealthRecord[];
  medications: Medication[];
  summary: HealthSummary;
  saveBloodPressure: (input: SaveBloodPressureInput) => void;
  saveWeight: (input: SaveWeightInput) => void;
  saveSymptoms: (input: SaveSymptomsInput) => void;
  saveMedication: (input: SaveMedicationInput) => void;
};

const HealthContext = createContext<HealthContextValue | null>(null);

function buildRecord(
  records: HealthRecord[],
  partial: Omit<HealthRecord, 'id' | 'recordedAt'> & { recordedAt?: string },
): HealthRecord {
  const currentSummary = computeHealthSummary(records);
  const profileWeight = getPatientProfile()?.weightKg ?? null;

  return {
    id: `hr-${Date.now()}`,
    recordedAt: partial.recordedAt ?? new Date().toISOString(),
    weightKg: partial.weightKg ?? currentSummary.currentWeightKg ?? profileWeight ?? undefined,
    systolic: partial.systolic ?? currentSummary.systolic ?? undefined,
    diastolic: partial.diastolic ?? currentSummary.diastolic ?? undefined,
    symptoms: partial.symptoms,
    symptomNotes: partial.symptomNotes,
  };
}

export function HealthProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  const summary = useMemo(() => {
    const computed = computeHealthSummary(records);
    const profileWeight = getPatientProfile()?.weightKg ?? null;

    return {
      currentWeightKg: computed.currentWeightKg ?? profileWeight,
      systolic: computed.systolic,
      diastolic: computed.diastolic,
      lastUpdatedAt: computed.lastUpdatedAt,
    };
  }, [records]);

  const saveBloodPressure = useCallback((input: SaveBloodPressureInput) => {
    setRecords((current) => [
      buildRecord(current, {
        systolic: input.systolic,
        diastolic: input.diastolic,
        symptoms: [],
      }),
      ...current,
    ]);
  }, []);

  const saveWeight = useCallback((input: SaveWeightInput) => {
    setRecords((current) => [
      buildRecord(current, {
        weightKg: input.weightKg,
        symptoms: [],
      }),
      ...current,
    ]);
  }, []);

  const saveSymptoms = useCallback((input: SaveSymptomsInput) => {
    setRecords((current) => [
      buildRecord(current, {
        symptoms: input.symptoms,
        symptomNotes: input.symptomNotes,
      }),
      ...current,
    ]);
  }, []);

  const saveMedication = useCallback((input: SaveMedicationInput) => {
    setMedications((current) => [
      {
        ...input,
        id: `med-${Date.now()}`,
      },
      ...current,
    ]);
  }, []);

  const value = useMemo(
    () => ({
      records,
      medications,
      summary,
      saveBloodPressure,
      saveWeight,
      saveSymptoms,
      saveMedication,
    }),
    [records, medications, summary, saveBloodPressure, saveWeight, saveSymptoms, saveMedication],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth() {
  const context = useContext(HealthContext);

  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }

  return context;
}
