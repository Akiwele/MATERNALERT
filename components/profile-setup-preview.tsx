import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PregnancyMetrics, formatDisplayDate } from '@/utils/pregnancy-calculations';

type ProfileSetupPreviewProps = {
  pregnancyMetrics: PregnancyMetrics | null;
  bmi: number | null;
};

export function ProfileSetupPreview({ pregnancyMetrics, bmi }: ProfileSetupPreviewProps) {
  if (!pregnancyMetrics && bmi === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Preview</Text>
      <Text style={styles.text}>
        {[
          pregnancyMetrics ? `Week ${pregnancyMetrics.weeks}+${pregnancyMetrics.days}` : null,
          pregnancyMetrics?.trimester ?? null,
          pregnancyMetrics ? `EDD ${formatDisplayDate(pregnancyMetrics.estimatedDeliveryDate)}` : null,
          bmi !== null ? `BMI ${bmi}` : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </Text>
      <Text style={styles.caption}>Full summary will appear on your dashboard.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 14,
    color: BrandColors.text,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
});
