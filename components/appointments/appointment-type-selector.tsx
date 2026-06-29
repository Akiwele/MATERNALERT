import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { APPOINTMENT_TYPES, type AppointmentType } from '@/constants/appointment-types';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';

type AppointmentTypeSelectorProps = {
  selectedType: AppointmentType | null;
  onSelect: (type: AppointmentType) => void;
  error?: string;
};

export function AppointmentTypeSelector({
  selectedType,
  onSelect,
  error,
}: AppointmentTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Appointment Type</Text>

      <Pressable style={styles.selector} onPress={() => setIsOpen((current) => !current)}>
        <Text style={[styles.selectorText, !selectedType && styles.placeholder]}>
          {selectedType ?? 'Select appointment type'}
        </Text>
        <ChevronDown size={20} color={BrandColors.textSecondary} />
      </Pressable>

      {isOpen ? (
        <View style={styles.dropdown}>
          <ScrollView style={styles.optionsList} nestedScrollEnabled>
            {APPOINTMENT_TYPES.map((type) => (
              <Pressable
                key={type}
                style={({ pressed }) => [
                  styles.option,
                  selectedType === type && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => {
                  onSelect(type);
                  setIsOpen(false);
                }}>
                <Text style={styles.optionText}>{type}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    zIndex: 4,
  },
  label: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.text,
  },
  selector: {
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    flex: 1,
    fontSize: PatientDashboardTypography.body,
    color: BrandColors.text,
    marginRight: 8,
  },
  placeholder: {
    color: BrandColors.textSecondary,
  },
  dropdown: {
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 14,
    overflow: 'hidden',
    maxHeight: 220,
  },
  optionsList: {
    maxHeight: 220,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  optionSelected: {
    backgroundColor: BrandColors.primaryMuted,
  },
  optionPressed: {
    backgroundColor: BrandColors.primaryLight,
  },
  optionText: {
    fontSize: PatientDashboardTypography.bodySmall,
    color: BrandColors.text,
  },
  error: {
    fontSize: PatientDashboardTypography.caption,
    color: '#B91C1C',
    lineHeight: 20,
  },
});
