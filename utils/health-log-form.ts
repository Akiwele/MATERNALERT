import type { SaveHealthRecordInput } from '@/types/health';

export type HealthLogFocusSection = 'bloodPressure' | 'weight' | 'symptoms' | 'medication';

export type HealthLogFormState = {
  systolic: string;
  diastolic: string;
  weight: string;
  selectedSymptoms: string[];
  otherSymptomDetails: string;
  medicationName: string;
  medicationDosage: string;
  medicationFrequency: string;
  medicationNotes: string;
  generalNotes: string;
};

export const createEmptyHealthLogForm = (initialWeight?: number | null): HealthLogFormState => ({
  systolic: '',
  diastolic: '',
  weight: initialWeight ? String(initialWeight) : '',
  selectedSymptoms: [],
  otherSymptomDetails: '',
  medicationName: '',
  medicationDosage: '',
  medicationFrequency: '',
  medicationNotes: '',
  generalNotes: '',
});

export function buildSaveHealthRecordInput(form: HealthLogFormState): SaveHealthRecordInput | null {
  const systolicValue = form.systolic.trim();
  const diastolicValue = form.diastolic.trim();
  const weightValue = form.weight.trim();
  const hasBloodPressure = Boolean(systolicValue || diastolicValue);
  const hasWeight = Boolean(weightValue);
  const hasSymptoms = form.selectedSymptoms.length > 0;
  const hasMedication = Boolean(
    form.medicationName.trim() ||
      form.medicationDosage.trim() ||
      form.medicationFrequency.trim() ||
      form.medicationNotes.trim(),
  );
  const hasGeneralNotes = Boolean(form.generalNotes.trim());

  if (!hasBloodPressure && !hasWeight && !hasSymptoms && !hasMedication && !hasGeneralNotes) {
    return null;
  }

  const input: SaveHealthRecordInput = {
    symptoms: form.selectedSymptoms,
  };

  if (hasBloodPressure) {
    const systolic = Number(systolicValue);
    const diastolic = Number(diastolicValue);

    if (
      !systolicValue ||
      !diastolicValue ||
      Number.isNaN(systolic) ||
      Number.isNaN(diastolic) ||
      systolic <= 0 ||
      diastolic <= 0
    ) {
      throw new Error('Enter valid systolic and diastolic blood pressure values.');
    }

    input.systolic = systolic;
    input.diastolic = diastolic;
  }

  if (hasWeight) {
    const weightKg = Number(weightValue);

    if (Number.isNaN(weightKg) || weightKg <= 0) {
      throw new Error('Enter a valid weight in kilograms.');
    }

    input.weightKg = weightKg;
  }

  if (form.selectedSymptoms.includes('Other') && form.otherSymptomDetails.trim()) {
    input.symptomNotes = form.otherSymptomDetails.trim();
  }

  if (hasMedication) {
    if (
      !form.medicationName.trim() ||
      !form.medicationDosage.trim() ||
      !form.medicationFrequency.trim()
    ) {
      throw new Error('Complete medication name, dosage, and frequency or leave medication blank.');
    }

    input.medication = {
      name: form.medicationName.trim(),
      dosage: form.medicationDosage.trim(),
      frequency: form.medicationFrequency.trim(),
      notes: form.medicationNotes.trim() || undefined,
    };
  }

  if (hasGeneralNotes) {
    input.notes = form.generalNotes.trim();
  }

  return input;
}
