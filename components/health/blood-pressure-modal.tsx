import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import type { SaveBloodPressureInput } from '@/types/health';

import { HealthModalShell } from './health-modal-shell';

type BloodPressureModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (input: SaveBloodPressureInput) => void;
};

export function BloodPressureModal({ visible, onClose, onSave }: BloodPressureModalProps) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');

  useEffect(() => {
    if (visible) {
      setSystolic('');
      setDiastolic('');
    }
  }, [visible]);

  const handleSave = () => {
    const systolicValue = parseInt(systolic, 10);
    const diastolicValue = parseInt(diastolic, 10);

    if (!systolic.trim() || !diastolic.trim() || Number.isNaN(systolicValue) || Number.isNaN(diastolicValue)) {
      Alert.alert('Invalid values', 'Please enter valid systolic and diastolic readings.');
      return;
    }

    if (systolicValue < 70 || systolicValue > 250 || diastolicValue < 40 || diastolicValue > 150) {
      Alert.alert('Invalid range', 'Please enter realistic blood pressure values.');
      return;
    }

    onSave({ systolic: systolicValue, diastolic: diastolicValue });
    onClose();
  };

  return (
    <HealthModalShell visible={visible} title="Blood Pressure" onClose={onClose}>
      <AuthTextField
        label="Systolic Pressure"
        placeholder="e.g. 118"
        value={systolic}
        onChangeText={setSystolic}
        keyboardType="number-pad"
      />
      <AuthTextField
        label="Diastolic Pressure"
        placeholder="e.g. 76"
        value={diastolic}
        onChangeText={setDiastolic}
        keyboardType="number-pad"
      />

      <View style={styles.actions}>
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <View style={styles.saveWrap}>
          <PrimaryButton label="Save" onPress={handleSave} />
        </View>
      </View>
    </HealthModalShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  saveWrap: {
    flex: 1,
  },
});
