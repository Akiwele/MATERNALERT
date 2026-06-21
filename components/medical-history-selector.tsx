import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthTextField } from '@/components/auth-text-field';
import { BrandColors } from '@/constants/brand';
import { MEDICAL_CONDITIONS, MedicalCondition } from '@/constants/medical-conditions';

type MedicalHistorySelectorProps = {
  selectedConditions: MedicalCondition[];
  onToggle: (condition: MedicalCondition) => void;
  otherDetails: string;
  onOtherDetailsChange: (value: string) => void;
};

export function MedicalHistorySelector({
  selectedConditions,
  onToggle,
  otherDetails,
  onOtherDetailsChange,
}: MedicalHistorySelectorProps) {
  const isOtherSelected = selectedConditions.includes('Other');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Existing Medical Conditions</Text>

      <View style={styles.chips}>
        {MEDICAL_CONDITIONS.map((condition) => {
          const isSelected = selectedConditions.includes(condition);

          return (
            <Pressable
              key={condition}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onToggle(condition)}>
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {condition}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isOtherSelected ? (
        <AuthTextField
          label="Specify other condition"
          placeholder="Describe other health conditions"
          value={otherDetails}
          onChangeText={onOtherDetailsChange}
          multiline
          numberOfLines={3}
          style={styles.otherInput}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: BrandColors.white,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: BrandColors.primaryMuted,
    borderColor: BrandColors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.textSecondary,
  },
  chipTextSelected: {
    color: BrandColors.primaryDark,
    fontWeight: '600',
  },
  otherInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
