import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { ClinicPatientRecord } from '@/types/clinic-records';

type ClinicPatientPickerProps = {
  patients: ClinicPatientRecord[];
  selectedPatientId: string | null;
  onSelect: (patientId: string) => void;
};

export function ClinicPatientPicker({
  patients,
  selectedPatientId,
  onSelect,
}: ClinicPatientPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Patient</Text>
      <ScrollView
        style={styles.list}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {patients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;

          return (
            <Pressable
              key={patient.id}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}
              onPress={() => onSelect(patient.id)}>
              <Text style={[styles.name, isSelected && styles.nameSelected]}>
                {patient.fullName}
              </Text>
              <Text style={[styles.meta, isSelected && styles.metaSelected]}>
                {patient.phoneNumber}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  list: {
    maxHeight: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    gap: 2,
  },
  optionSelected: {
    backgroundColor: BrandColors.primaryMuted,
  },
  optionPressed: {
    opacity: 0.9,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
  },
  nameSelected: {
    color: BrandColors.primaryDark,
  },
  meta: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  metaSelected: {
    color: BrandColors.primary,
  },
});
