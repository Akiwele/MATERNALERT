import { ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { PregnancyRiskDisplay } from '@/utils/pregnancy-risk';

type PregnancyRiskCardProps = {
  risk: PregnancyRiskDisplay;
};

export function PregnancyRiskCard({ risk }: PregnancyRiskCardProps) {
  const isHighRisk = risk.status === 'High Risk';
  const Icon = isHighRisk ? ShieldAlert : ShieldCheck;

  return (
    <View
      style={[
        styles.card,
        isHighRisk ? styles.cardHighRisk : styles.cardLowRisk,
      ]}>
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            isHighRisk ? styles.iconWrapHighRisk : styles.iconWrapLowRisk,
          ]}>
          <Icon
            size={18}
            color={isHighRisk ? '#B91C1C' : BrandColors.primaryDark}
          />
        </View>
        <Text
          style={[
            styles.headline,
            isHighRisk ? styles.headlineHighRisk : styles.headlineLowRisk,
          ]}>
          {risk.headline}
        </Text>
      </View>
      <Text style={styles.reason}>{risk.reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  cardLowRisk: {
    backgroundColor: BrandColors.primaryMuted,
    borderColor: BrandColors.primaryLight,
  },
  cardHighRisk: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapLowRisk: {
    backgroundColor: BrandColors.primaryLight,
  },
  iconWrapHighRisk: {
    backgroundColor: '#FEE2E2',
  },
  headline: {
    flex: 1,
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '700',
    lineHeight: 24,
  },
  headlineLowRisk: {
    color: BrandColors.primaryDark,
  },
  headlineHighRisk: {
    color: '#B91C1C',
  },
  reason: {
    fontSize: PatientDashboardTypography.bodySmall,
    lineHeight: 22,
    color: BrandColors.textSecondary,
    paddingLeft: 42,
  },
});
