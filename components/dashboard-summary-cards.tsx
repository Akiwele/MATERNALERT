import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PatientProfile } from '@/stores/patient-profile';
import {
  calculateBmi,
  calculatePregnancyMetrics,
  formatDisplayDate,
} from '@/utils/pregnancy-calculations';

type DashboardSummaryCardsProps = {
  profile: PatientProfile;
};

export function DashboardSummaryCards({ profile }: DashboardSummaryCardsProps) {
  const pregnancyMetrics = calculatePregnancyMetrics(profile.lmpDate);
  const bmi = calculateBmi(profile.heightCm, profile.weightKg);
  const { bloodGroup, riskStatus } = profile;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Pregnancy Summary</Text>
      <View style={styles.cards}>
        <SummaryCard
          label="Current Pregnancy Week"
          value={`Week ${pregnancyMetrics.weeks}`}
          subValue={`+ ${pregnancyMetrics.days} days`}
        />
        <SummaryCard label="Current Trimester" value={pregnancyMetrics.trimester} />
        <SummaryCard
          label="Estimated Delivery Date"
          value={formatDisplayDate(pregnancyMetrics.estimatedDeliveryDate)}
        />
      </View>

      <Text style={styles.sectionTitle}>Health Summary</Text>
      <View style={styles.cards}>
        <SummaryCard
          label="BMI"
          value={bmi !== null ? bmi.toString() : '—'}
          subValue={bmi !== null ? getBmiCategory(bmi) : undefined}
        />
        <SummaryCard label="Blood Group" value={bloodGroup ?? 'Not provided'} />
        <SummaryCard label="Risk Status" value={riskStatus} highlight={riskStatus === 'High Risk'} />
      </View>
    </View>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
};

function SummaryCard({ label, value, subValue, highlight = false }: SummaryCardProps) {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {subValue ? <Text style={styles.cardSubValue}>{subValue}</Text> : null}
    </View>
  );
}

function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal range';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: 4,
  },
  cardHighlight: {
    backgroundColor: BrandColors.primaryLight,
    borderColor: BrandColors.primary,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.text,
    lineHeight: 28,
  },
  cardSubValue: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
});
