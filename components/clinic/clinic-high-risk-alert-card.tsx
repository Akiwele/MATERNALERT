import { AlertTriangle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { HighRiskAlert } from '@/types/clinic-records';

type ClinicHighRiskAlertCardProps = {
  alert: HighRiskAlert;
};

export function ClinicHighRiskAlertCard({ alert }: ClinicHighRiskAlertCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <AlertTriangle size={18} color="#DC2626" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{alert.patientName}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{alert.reason}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BrandColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.text,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DC2626',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.white,
  },
});
