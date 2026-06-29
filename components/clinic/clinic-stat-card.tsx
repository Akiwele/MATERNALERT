import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type ClinicStatCardProps = {
  label: string;
  value: number | string;
  accentColor?: string;
};

export function ClinicStatCard({ label, value, accentColor = BrandColors.primary }: ClinicStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 14,
    gap: 4,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    lineHeight: 16,
  },
});
