import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { AuthDateField } from '@/components/auth-date-field';
import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import type { SaveMedicationInput } from '@/types/health';

import { HealthModalShell } from './health-modal-shell';

type MedicationModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (input: SaveMedicationInput) => void;
};

const createInitialForm = () => ({
  name: '',
  dosage: '',
  frequency: '',
  startDate: null as Date | null,
  notes: '',
});

export function MedicationModal({ visible, onClose, onSave }: MedicationModalProps) {
  const [form, setForm] = useState(createInitialForm);

  useEffect(() => {
    if (visible) {
      setForm(createInitialForm());
    }
  }, [visible]);

  const handleSave = () => {
    if (!form.name.trim() || !form.dosage.trim() || !form.frequency.trim() || !form.startDate) {
      Alert.alert('Missing information', 'Please complete all required medication fields.');
      return;
    }

    onSave({
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency.trim(),
      startDate: form.startDate.toISOString(),
      notes: form.notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <HealthModalShell visible={visible} title="Add Medication" onClose={onClose}>
      <AuthTextField
        label="Medication Name"
        placeholder="e.g. Folic Acid"
        value={form.name}
        onChangeText={(name) => setForm((current) => ({ ...current, name }))}
      />
      <AuthTextField
        label="Dosage"
        placeholder="e.g. 5 mg"
        value={form.dosage}
        onChangeText={(dosage) => setForm((current) => ({ ...current, dosage }))}
      />
      <AuthTextField
        label="Frequency"
        placeholder="e.g. Once daily"
        value={form.frequency}
        onChangeText={(frequency) => setForm((current) => ({ ...current, frequency }))}
      />
      <AuthDateField
        label="Start Date"
        value={form.startDate}
        onChange={(startDate) => setForm((current) => ({ ...current, startDate }))}
        maximumDate={new Date()}
      />
      <AuthTextField
        label="Notes (optional)"
        placeholder="Any additional instructions"
        value={form.notes}
        onChangeText={(notes) => setForm((current) => ({ ...current, notes }))}
        multiline
        numberOfLines={3}
        style={{ minHeight: 88, textAlignVertical: 'top' }}
      />
      <PrimaryButton label="Save" onPress={handleSave} />
    </HealthModalShell>
  );
}
