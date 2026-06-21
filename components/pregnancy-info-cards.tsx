import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PregnancyMetrics, formatDisplayDate } from '@/utils/pregnancy-calculations';

type PregnancyInfoCardsProps = {
  metrics: PregnancyMetrics;
};

export function PregnancyInfoCards({ metrics }: PregnancyInfoCardsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Pregnancy Summary</Text>

      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Current Pregnancy Week</Text>
          <Text style={styles.cardValue}>Week {metrics.weeks}</Text>
          <Text style={styles.cardSubValue}>+ {metrics.days} days</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Current Trimester</Text>
          <Text style={styles.cardValue}>{metrics.trimester}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Estimated Delivery Date</Text>
          <Text style={styles.cardValue}>{formatDisplayDate(metrics.estimatedDeliveryDate)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    gap: 4,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.text,
  },
  cardSubValue: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
});
