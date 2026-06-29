import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { ClinicAppointment } from '@/types/clinic-records';
import { formatClinicTime } from '@/utils/clinic-date-utils';

type ClinicDashboardAppointmentRowProps = {
  appointment: ClinicAppointment;
};

export function ClinicDashboardAppointmentRow({ appointment }: ClinicDashboardAppointmentRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <Text style={styles.name}>{appointment.patientName}</Text>
        <Text style={styles.meta}>{appointment.visitType}</Text>
      </View>
      <Text style={styles.time}>{formatClinicTime(appointment.time)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  content: {
    flex: 1,
    gap: 2,
    paddingRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
  },
  meta: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
});
