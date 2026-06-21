import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type DashboardCardProps = {
  title: string;
  children: ReactNode;
  highlight?: boolean;
};

export function DashboardCard({ title, children, highlight = false }: DashboardCardProps) {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

type DashboardRowProps = {
  label: string;
  value: string;
};

export function DashboardRow({ label, value }: DashboardRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 12,
  },
  cardHighlight: {
    borderColor: BrandColors.primary,
    backgroundColor: BrandColors.primaryMuted,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    textAlign: 'right',
  },
});
