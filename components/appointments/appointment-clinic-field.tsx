import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClinicSelector } from '@/components/clinic-selector';
import { BrandColors } from '@/constants/brand';
import type { Clinic } from '@/constants/clinics';

type AppointmentClinicFieldProps = {
  clinic: Clinic | null;
  onSelectClinic: (clinic: Clinic) => void;
  error?: string;
};

export function AppointmentClinicField({
  clinic,
  onSelectClinic,
  error,
}: AppointmentClinicFieldProps) {
  const [showSelector, setShowSelector] = useState(false);

  const handleSelectClinic = (selectedClinic: Clinic) => {
    onSelectClinic(selectedClinic);
    setShowSelector(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Clinic</Text>

      <View style={styles.card}>
        {clinic ? (
          <Text style={styles.clinicName}>{clinic.name}</Text>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No clinic selected</Text>
            <Pressable onPress={() => setShowSelector(true)} hitSlop={6}>
              <Text style={styles.selectLink}>Select Clinic</Text>
            </Pressable>
          </View>
        )}
      </View>

      {clinic ? (
        <Pressable onPress={() => setShowSelector((current) => !current)} hitSlop={6}>
          <Text style={styles.changeLink}>
            {showSelector ? 'Hide clinic list' : 'Change clinic'}
          </Text>
        </Pressable>
      ) : null}

      {showSelector ? (
        <ClinicSelector
          selectedClinic={clinic}
          onSelect={handleSelectClinic}
          error={error}
        />
      ) : error && !showSelector ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    zIndex: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  card: {
    backgroundColor: BrandColors.primaryMuted,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.primaryDark,
    lineHeight: 22,
  },
  emptyState: {
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    color: BrandColors.textSecondary,
  },
  selectLink: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primary,
    alignSelf: 'flex-start',
  },
  error: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
});
