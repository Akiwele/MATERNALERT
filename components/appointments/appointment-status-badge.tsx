import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { AppointmentStatus } from '@/utils/appointments';

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
};

const STATUS_STYLES: Record<
  AppointmentStatus,
  { backgroundColor: string; borderColor: string; textColor: string; label: string }
> = {
  upcoming: {
    backgroundColor: BrandColors.primaryMuted,
    borderColor: BrandColors.primaryLight,
    textColor: BrandColors.primaryDark,
    label: 'Upcoming',
  },
  missed: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    textColor: '#B91C1C',
    label: 'Missed',
  },
  completed: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
    label: 'Completed',
  },
};

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const palette = STATUS_STYLES[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
      ]}>
      <Text style={[styles.label, { color: palette.textColor }]}>{palette.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '700',
  },
});
