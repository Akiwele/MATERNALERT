import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicPatientListCard } from '@/components/clinic/clinic-patient-list-card';
import { ClinicPatientSearchBar } from '@/components/clinic/clinic-patient-search-bar';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';
import { getClinicPatientDetailsHref } from '@/utils/clinic-navigation';

export default function ClinicPatientsScreen() {
  const router = useRouter();
  const { searchPatients, getAccessiblePatients } = useClinicData();
  const [query, setQuery] = useState('');

  const patients = useMemo(() => {
    if (!query.trim()) {
      return getAccessiblePatients();
    }

    return searchPatients(query);
  }, [getAccessiblePatients, query, searchPatients]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Patients</Text>
          <Text style={styles.subtitle}>
            Search by full name, phone number, or email address.
          </Text>
        </View>

        <ClinicPatientSearchBar value={query} onChangeText={setQuery} />

        {patients.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No patients found</Text>
            <Text style={styles.emptyText}>
              Try another name, phone number, or email address.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {patients.map((patient) => (
              <ClinicPatientListCard
                key={patient.id}
                patient={patient}
                onPress={(selected) => router.push(getClinicPatientDetailsHref(selected.id))}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
  },
  list: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
  },
});
