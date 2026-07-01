import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { ClinicAppointment } from '@/types/clinic-records';
import { formatClinicDate, formatClinicTime } from '@/utils/clinic-date-utils';

type ClinicAppointmentListCardProps = {
  appointment: ClinicAppointment;
  onMarkAttended?: () => void;
  onMarkMissed?: () => void;
  onReschedule?: () => void;
  showActions?: boolean;
};

const STATUS_STYLES: Record<
  ClinicAppointment['status'],
  { bg: string; text: string; label: string }
> = {
  scheduled: { bg: BrandColors.primaryMuted, text: BrandColors.primaryDark, label: 'Scheduled' },
  attended: { bg: '#DCFCE7', text: '#166534', label: 'Attended' },
  missed: { bg: '#FEE2E2', text: '#B91C1C', label: 'Missed' },
  reschedule_requested: { bg: '#FFFBEB', text: '#B45309', label: 'Reschedule Requested' },
  rescheduled: { bg: '#E0F2FE', text: '#0369A1', label: 'Rescheduled' },
};

function StatusPill({ status }: { status: ClinicAppointment['status'] }) {
  const stylesByStatus = STATUS_STYLES[status];

  return (
    <View style={[styles.statusPill, { backgroundColor: stylesByStatus.bg }]}>
      <Text style={[styles.statusText, { color: stylesByStatus.text }]}>
        {stylesByStatus.label}
      </Text>
    </View>
  );
}

export function ClinicAppointmentListCard({
  appointment,
  onMarkAttended,
  onMarkMissed,
  onReschedule,
  showActions = true,
}: ClinicAppointmentListCardProps) {
  const isActionable =
    appointment.status === 'scheduled' || appointment.status === 'reschedule_requested';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{appointment.patientName}</Text>
          <Text style={styles.phone}>{appointment.phoneNumber}</Text>
        </View>
        <StatusPill status={appointment.status} />
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>{formatClinicDate(appointment.date)}</Text>
        <Text style={styles.detailText}>{formatClinicTime(appointment.time)}</Text>
        <Text style={styles.detailText}>{appointment.visitType}</Text>
        {appointment.notes?.trim() ? (
          <Text style={styles.notesText}>Notes: {appointment.notes.trim()}</Text>
        ) : null}
      </View>

      {showActions && isActionable ? (
        <View style={styles.actions}>
          {appointment.status === 'scheduled' ? (
            <Pressable style={styles.actionButton} onPress={onMarkAttended}>
              <Text style={styles.actionTextPrimary}>Mark Attended</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.actionButton} onPress={onMarkMissed}>
            <Text style={styles.actionTextDanger}>Mark Missed</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onReschedule}>
            <Text style={styles.actionTextSecondary}>
              {appointment.status === 'reschedule_requested' ? 'Set New Date' : 'Reschedule'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
    gap: 12,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerContent: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  phone: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  details: {
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: BrandColors.text,
  },
  notesText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: BrandColors.primaryMuted,
  },
  actionTextPrimary: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  actionTextDanger: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
  },
  actionTextSecondary: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.textSecondary,
  },
});
