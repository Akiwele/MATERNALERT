import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ClinicRiskBadge } from '@/components/clinic/clinic-risk-badge';
import { BrandColors } from '@/constants/brand';
import type { ClinicPatientRecord } from '@/types/clinic-records';
import { formatClinicDate } from '@/utils/clinic-date-utils';

type ClinicPatientListCardProps = {
  patient: ClinicPatientRecord;
  onPress: (patient: ClinicPatientRecord) => void;
};

export function ClinicPatientListCard({ patient, onPress }: ClinicPatientListCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(patient)}>
      <View style={styles.header}>
        <Text style={styles.name}>{patient.fullName}</Text>
        <ClinicRiskBadge riskStatus={patient.riskStatus} />
      </View>
      <Text style={styles.meta}>{patient.phoneNumber}</Text>
      {patient.ancBookNumber ? (
        <Text style={styles.meta}>ANC Book: {patient.ancBookNumber}</Text>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Week {patient.currentWeek}</Text>
        <Text style={styles.footerText}>
          Last visit: {patient.lastVisitDate ? formatClinicDate(patient.lastVisitDate) : 'None'}
        </Text>
      </View>
      <ChevronRight size={18} color={BrandColors.textSecondary} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
    gap: 4,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingRight: 24,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  meta: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingRight: 24,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
  chevron: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -9,
  },
});
