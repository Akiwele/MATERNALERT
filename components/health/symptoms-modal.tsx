import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { HEALTH_SYMPTOMS, type HealthSymptom } from '@/constants/health-symptoms';
import { BrandColors } from '@/constants/brand';
import type { SaveSymptomsInput } from '@/types/health';

import { HealthModalShell } from './health-modal-shell';

type SymptomsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (input: SaveSymptomsInput) => void;
};

export function SymptomsModal({ visible, onClose, onSave }: SymptomsModalProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<HealthSymptom[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (visible) {
      setSelectedSymptoms([]);
      setNotes('');
    }
  }, [visible]);

  const toggleSymptom = (symptom: HealthSymptom) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom],
    );
  };

  const handleSave = () => {
    onSave({
      symptoms: selectedSymptoms,
      symptomNotes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <HealthModalShell visible={visible} title="Symptoms" onClose={onClose}>
      <Text style={styles.helperText}>Select any symptoms you are experiencing.</Text>

      <View style={styles.chipGrid}>
        {HEALTH_SYMPTOMS.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom);

          return (
            <Pressable
              key={symptom}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleSymptom(symptom)}>
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{symptom}</Text>
            </Pressable>
          );
        })}
      </View>

      <AuthTextField
        label="Additional Notes (optional)"
        placeholder="Describe any other symptoms"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.notesInput}
      />

      <PrimaryButton label="Save" onPress={handleSave} />
    </HealthModalShell>
  );
}

const styles = StyleSheet.create({
  helperText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
    marginTop: -4,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
  chipSelected: {
    borderColor: BrandColors.primary,
    backgroundColor: BrandColors.primaryMuted,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.text,
  },
  chipTextSelected: {
    color: BrandColors.primaryDark,
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
