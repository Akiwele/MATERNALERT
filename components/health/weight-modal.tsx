import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import type { SaveWeightInput } from '@/types/health';

import { HealthModalShell } from './health-modal-shell';

type WeightModalProps = {
  visible: boolean;
  initialWeight?: number | null;
  onClose: () => void;
  onSave: (input: SaveWeightInput) => void;
};

export function WeightModal({ visible, initialWeight, onClose, onSave }: WeightModalProps) {
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (visible) {
      setWeight(initialWeight ? String(initialWeight) : '');
    }
  }, [visible, initialWeight]);

  const handleSave = () => {
    const weightValue = parseFloat(weight);

    if (!weight.trim() || Number.isNaN(weightValue) || weightValue <= 0) {
      Alert.alert('Invalid weight', 'Please enter a valid weight in kilograms.');
      return;
    }

    onSave({ weightKg: weightValue });
    onClose();
  };

  return (
    <HealthModalShell visible={visible} title="Weight" onClose={onClose}>
      <AuthTextField
        label="Current Weight (kg)"
        placeholder="e.g. 68"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
      />
      <PrimaryButton label="Save" onPress={handleSave} />
    </HealthModalShell>
  );
}
