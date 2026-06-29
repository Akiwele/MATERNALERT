import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getPatientProfile } from '@/stores/patient-profile';
import type { HealthRecord, HealthSummary, Medication, SaveHealthRecordInput } from '@/types/health';
import { computeHealthSummary } from '@/utils/health-display';

type HealthContextValue = {
  records: HealthRecord[];
  medications: Medication[];
  summary: HealthSummary;
  saveHealthRecord: (input: SaveHealthRecordInput) => void;
};

const HealthContext = createContext<HealthContextValue | null>(null);

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

  const saveHealthRecord = useCallback((input: SaveHealthRecordInput) => {
    const recordedAt = new Date().toISOString();
    const recordId = `hr-${Date.now()}`;

    const record: HealthRecord = {
      id: recordId,
      recordedAt,
      symptoms: input.symptoms ?? [],
      symptomNotes: input.symptomNotes,
      notes: input.notes,
    };

    if (input.systolic !== undefined && input.diastolic !== undefined) {
      record.systolic = input.systolic;
      record.diastolic = input.diastolic;
    }

    if (input.weightKg !== undefined) {
      record.weightKg = input.weightKg;
    }

    if (input.medication) {
      record.medication = input.medication;
    }

    setRecords((current) => [record, ...current]);

    if (input.medication) {
      setMedications((current) => [
        {
          id: `med-${Date.now()}`,
          name: input.medication!.name,
          dosage: input.medication!.dosage,
          frequency: input.medication!.frequency,
          startDate: recordedAt,
          notes: input.medication!.notes,
        },
        ...current,
      ]);
    }
  }, []);

  const value = useMemo(
    () => ({
      records,
      medications,
      summary,
      saveHealthRecord,
    }),
    [records, medications, summary, saveHealthRecord],
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
