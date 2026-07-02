import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type ClinicDetailRowProps = {
  label: string;
  value: string;
  showDivider?: boolean;
};

export function ClinicDetailRow({ label, value, showDivider = true }: ClinicDetailRowProps) {
  return (
    <View style={[styles.row, !showDivider && styles.rowSpaced]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    gap: 4,
  },
  rowSpaced: {
    paddingVertical: 0,
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    lineHeight: 21,
  },
});
