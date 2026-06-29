export type HealthRecordMedication = {
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
};

export type HealthRecord = {
  id: string;
  recordedAt: string;
  weightKg?: number;
  systolic?: number;
  diastolic?: number;
  symptoms: string[];
  symptomNotes?: string;
  medication?: HealthRecordMedication;
  notes?: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  notes?: string;
};

export type HealthSummary = {
  currentWeightKg: number | null;
  systolic: number | null;
  diastolic: number | null;
  lastUpdatedAt: string | null;
};

export type SaveHealthRecordInput = {
  systolic?: number;
  diastolic?: number;
  weightKg?: number;
  symptoms?: string[];
  symptomNotes?: string;
  medication?: HealthRecordMedication;
  notes?: string;
};
