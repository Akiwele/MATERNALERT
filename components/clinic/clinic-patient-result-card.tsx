import { ChevronRight, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { CareNetworkPatient } from '@/types/clinic-patient';
import { clinicHasRecordAccess } from '@/utils/clinic-patient-search';

type ClinicPatientResultCardProps = {
  patient: CareNetworkPatient;
  clinicName: string;
  onPress: (patient: CareNetworkPatient) => void;
};

export function ClinicPatientResultCard({
  patient,
  clinicName,
  onPress,
}: ClinicPatientResultCardProps) {
  const hasAccess = clinicHasRecordAccess(patient, clinicName);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(patient)}>
      <View style={styles.avatar}>
        <UserRound size={20} color={BrandColors.primaryDark} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{patient.fullName}</Text>
        <Text style={styles.meta}>{patient.phoneNumber}</Text>
        {patient.ancBookNumber ? (
          <Text style={styles.meta}>ANC Book: {patient.ancBookNumber}</Text>
        ) : null}
        <Text style={styles.clinicLine}>Registered at {patient.registeredClinicName}</Text>
      </View>

      <View style={styles.trailing}>
        <View style={[styles.badge, hasAccess ? styles.badgeGranted : styles.badgePending]}>
          <Text style={[styles.badgeText, hasAccess ? styles.badgeTextGranted : styles.badgeTextPending]}>
            {hasAccess ? 'Access granted' : 'Consent needed'}
          </Text>
        </View>
        <ChevronRight size={18} color={BrandColors.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 14,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  meta: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  clinicLine: {
    fontSize: 12,
    color: BrandColors.primaryDark,
    marginTop: 2,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeGranted: {
    backgroundColor: BrandColors.primaryMuted,
  },
  badgePending: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextGranted: {
    color: BrandColors.primaryDark,
  },
  badgeTextPending: {
    color: '#B45309',
  },
});
