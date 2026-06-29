import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentStatus,
  type AntenatalAppointment,
} from '@/utils/appointments';

type AppointmentListItemProps = {
  appointment: AntenatalAppointment;
  onMarkCompleted?: (id: string) => void;
};

export function AppointmentListItem({ appointment, onMarkCompleted }: AppointmentListItemProps) {
  const status = getAppointmentStatus(appointment);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.clinicName}>{appointment.clinicName}</Text>
        <AppointmentStatusBadge status={status} />
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Date</Text>
        <Text style={styles.detailValue}>{formatAppointmentDate(appointment.appointmentDate)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Time</Text>
        <Text style={styles.detailValue}>
          {formatAppointmentTime(appointment.appointmentTime)}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Type</Text>
        <Text style={styles.detailValue}>{appointment.appointmentType}</Text>
      </View>

      {appointment.notes?.trim() ? (
        <View style={styles.notesBlock}>
          <Text style={styles.detailLabel}>Notes</Text>
          <Text style={styles.notesText}>{appointment.notes.trim()}</Text>
        </View>
      ) : null}

      {status === 'upcoming' && onMarkCompleted ? (
        <Pressable
          style={({ pressed }) => [styles.completeButton, pressed && styles.completeButtonPressed]}
          onPress={() => onMarkCompleted(appointment.id)}>
          <Text style={styles.completeButtonText}>Mark as Completed</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 10,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  clinicName: {
    flex: 1,
    fontSize: PatientDashboardTypography.body,
    fontWeight: '700',
    color: BrandColors.text,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailLabel: {
    fontSize: PatientDashboardTypography.label,
    color: BrandColors.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.text,
    textAlign: 'right',
    lineHeight: 22,
  },
  notesBlock: {
    gap: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: BrandColors.border,
  },
  notesText: {
    fontSize: PatientDashboardTypography.label,
    lineHeight: 22,
    color: BrandColors.text,
  },
  completeButton: {
    marginTop: 4,
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
  },
  completeButtonPressed: {
    opacity: 0.88,
  },
  completeButtonText: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
});
