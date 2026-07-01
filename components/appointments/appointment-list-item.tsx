import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

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
  onRequestReschedule?: (id: string) => void;
};

export function AppointmentListItem({
  appointment,
  onRequestReschedule,
}: AppointmentListItemProps) {
  const status = getAppointmentStatus(appointment);
  const canRequestReschedule =
    (status === 'upcoming' || status === 'reschedule_requested') &&
    appointment.clinicalStatus !== 'reschedule_requested';

  const handleRequestReschedule = () => {
    Alert.alert(
      'Request Reschedule',
      'Your clinic will be notified. They will set a new date and time for you.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => onRequestReschedule?.(appointment.id),
        },
      ],
    );
  };

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

      {status === 'reschedule_requested' ? (
        <Text style={styles.pendingNote}>
          Reschedule requested. Your clinic will contact you with a new date.
        </Text>
      ) : null}

      {canRequestReschedule && onRequestReschedule ? (
        <Pressable
          style={({ pressed }) => [styles.rescheduleButton, pressed && styles.rescheduleButtonPressed]}
          onPress={handleRequestReschedule}>
          <Text style={styles.rescheduleButtonText}>Request Reschedule</Text>
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
  pendingNote: {
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rescheduleButton: {
    marginTop: 4,
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
  },
  rescheduleButtonPressed: {
    opacity: 0.88,
  },
  rescheduleButtonText: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
});
