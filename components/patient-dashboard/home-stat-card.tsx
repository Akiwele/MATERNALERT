import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';

export type HomeStatStatus = 'normal' | 'warning' | 'upcoming';

type HomeStatCardProps = {
  label: string;
  value: string;
  unit: string;
  status: HomeStatStatus;
  icon: LucideIcon;
};

const STATUS_STYLES: Record<
  HomeStatStatus,
  { backgroundColor: string; iconColor: string }
> = {
  normal: { backgroundColor: '#D1FAE5', iconColor: '#059669' },
  warning: { backgroundColor: '#FEF3C7', iconColor: '#D97706' },
  upcoming: { backgroundColor: '#DBEAFE', iconColor: '#2563EB' },
};

export function HomeStatCard({ label, value, unit, status, icon: Icon }: HomeStatCardProps) {
  const statusStyle = STATUS_STYLES[status];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.iconWrap, { backgroundColor: statusStyle.backgroundColor }]}>
          <Icon size={12} color={statusStyle.iconColor} />
        </View>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: BrandColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: PatientDashboardTypography.statValue,
    fontWeight: '700',
    color: BrandColors.text,
  },
  unit: {
    fontSize: PatientDashboardTypography.caption,
    color: BrandColors.textSecondary,
  },
});
