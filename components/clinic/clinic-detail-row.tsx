import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type ClinicDetailRowProps = {
  label: string;
  value: string;
};

export function ClinicDetailRow({ label, value }: ClinicDetailRowProps) {
  return (
    <View style={styles.row}>
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    lineHeight: 21,
  },
});
