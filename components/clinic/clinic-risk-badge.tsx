import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { RiskLevel } from '@/types/clinic-records';

type ClinicRiskBadgeProps = {
  riskStatus: RiskLevel;
};

export function ClinicRiskBadge({ riskStatus }: ClinicRiskBadgeProps) {
  const isHighRisk = riskStatus === 'High Risk';

  return (
    <View style={[styles.badge, isHighRisk ? styles.highRisk : styles.lowRisk]}>
      <Text style={[styles.text, isHighRisk ? styles.highRiskText : styles.lowRiskText]}>
        {riskStatus}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lowRisk: {
    backgroundColor: BrandColors.primaryMuted,
  },
  highRisk: {
    backgroundColor: '#FEE2E2',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  lowRiskText: {
    color: BrandColors.primaryDark,
  },
  highRiskText: {
    color: '#B91C1C',
  },
});
