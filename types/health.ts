export type HealthRecord = {
  id: string;
  recordedAt: string;
  weightKg?: number;
  systolic?: number;
  diastolic?: number;
  symptoms: string[];
  symptomNotes?: string;
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

export type SaveBloodPressureInput = {
  systolic: number;
  diastolic: number;
};

export type SaveWeightInput = {
  weightKg: number;
};

export type SaveSymptomsInput = {
  symptoms: string[];
  symptomNotes?: string;
};

export type SaveMedicationInput = Omit<Medication, 'id'>;
