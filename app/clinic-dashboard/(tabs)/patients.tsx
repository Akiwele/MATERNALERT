import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicPatientListCard } from '@/components/clinic/clinic-patient-list-card';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';
import { getClinicPatientDetailsHref } from '@/utils/clinic-navigation';

export default function ClinicPatientsScreen() {
  const router = useRouter();
  const { getAccessiblePatients } = useClinicData();
  const patients = getAccessiblePatients();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Patients</Text>
        </View>

        {patients.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No patients found</Text>
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
});
