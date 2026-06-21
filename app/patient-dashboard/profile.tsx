import { User } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';
import { getPatientRegistration } from '@/stores/patient-registration';
import { getPatientProfile } from '@/stores/patient-profile';

export default function PatientProfileScreen() {
  const registration = getPatientRegistration();
  const profile = getPatientProfile();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <User size={32} color={BrandColors.primary} />
        </View>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          {registration
            ? `${registration.fullName}\n${registration.email}`
            : 'Your profile details will appear here.'}
        </Text>
        {registration?.clinic ? (
          <View style={styles.clinicCard}>
            <Text style={styles.clinicLabel}>My Clinic</Text>
            <Text style={styles.clinicName}>{registration.clinic.name}</Text>
            <Text style={styles.clinicCode}>{registration.clinic.code}</Text>
          </View>
        ) : null}
        {profile?.bloodGroup ? (
          <Text style={styles.meta}>Blood Group: {profile.bloodGroup}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
  clinicCard: {
    marginTop: 8,
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    gap: 4,
    alignItems: 'center',
  },
  clinicLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
  },
  clinicCode: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  meta: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
});
