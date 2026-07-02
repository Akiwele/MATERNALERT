import { AlertTriangle, Calendar } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentListItem } from '@/components/appointments/appointment-list-item';
import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import { DashboardCard } from '@/components/patient-dashboard/dashboard-card';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import { useAppointments } from '@/contexts/appointments-context';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentStatus,
} from '@/utils/appointments';

function AppointmentSection({
  title,
  appointments,
  emptyText,
  onRequestReschedule,
}: {
  title: string;
  appointments: ReturnType<typeof useAppointments>['upcomingAppointments'];
  emptyText: string;
  onRequestReschedule?: (id: string) => void;
}) {
  return (
    <View style={styles.listSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {appointments.length > 0 ? (
        <View style={styles.list}>
          {appointments.map((appointment) => (
            <AppointmentListItem
              key={appointment.id}
              appointment={appointment}
              onRequestReschedule={onRequestReschedule}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyListText}>{emptyText}</Text>
      )}
    </View>
  );
}

export default function PatientAppointmentsScreen() {
  const {
    nextAppointment,
    upcomingAppointments,
    missedAppointments,
    completedAppointments,
    reminders,
    missedAncWarning,
    requestReschedule,
  } = useAppointments();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Appointments</Text>

        {reminders.map((reminder) => (
          <View
            key={reminder.id}
            style={[
              styles.reminderBanner,
              reminder.tone === 'today' ? styles.reminderToday : styles.reminderTomorrow,
            ]}>
            <Calendar
              size={18}
              color={reminder.tone === 'today' ? BrandColors.primaryDark : '#0369A1'}
            />
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderMessage}>{reminder.message}</Text>
            </View>
          </View>
        ))}

        {missedAncWarning ? (
          <View style={styles.warningBanner}>
            <AlertTriangle size={18} color="#B45309" />
            <Text style={styles.warningText}>{missedAncWarning}</Text>
          </View>
        ) : null}

        <DashboardCard title="Next Appointment">
          {nextAppointment ? (
            <View style={styles.nextAppointmentContent}>
              <View style={styles.nextAppointmentHeader}>
                <Text style={styles.nextClinicName}>{nextAppointment.clinicName}</Text>
                <AppointmentStatusBadge status={getAppointmentStatus(nextAppointment)} />
              </View>
              <Text style={styles.nextDetail}>
                {formatAppointmentDate(nextAppointment.appointmentDate)}
              </Text>
              <Text style={styles.nextDetail}>
                {formatAppointmentTime(nextAppointment.appointmentTime)}
              </Text>
              <Text style={styles.nextType}>{nextAppointment.appointmentType}</Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No upcoming appointment. Your clinic will schedule your next ANC visit.
            </Text>
          )}
        </DashboardCard>

        <AppointmentSection
          title="Upcoming Appointments"
          appointments={upcomingAppointments}
          emptyText="No upcoming appointments scheduled by your clinic."
          onRequestReschedule={requestReschedule}
        />

        <AppointmentSection
          title="Missed Appointments"
          appointments={missedAppointments}
          emptyText="No missed appointments."
        />

        <AppointmentSection
          title="Completed Appointments"
          appointments={completedAppointments}
          emptyText="No completed appointments yet."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  title: {
    fontSize: PatientDashboardTypography.pageTitle,
    fontWeight: '700',
    color: BrandColors.text,
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  reminderToday: {
    backgroundColor: BrandColors.primaryMuted,
    borderColor: BrandColors.primaryLight,
  },
  reminderTomorrow: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
  },
  reminderCopy: {
    flex: 1,
    gap: 2,
  },
  reminderTitle: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '700',
    color: BrandColors.text,
  },
  reminderMessage: {
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    color: BrandColors.textSecondary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    flex: 1,
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    color: '#B45309',
  },
  nextAppointmentContent: {
    gap: 6,
  },
  nextAppointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  nextClinicName: {
    flex: 1,
    fontSize: PatientDashboardTypography.cardTitleLarge,
    fontWeight: '700',
    color: BrandColors.primaryDark,
    lineHeight: 26,
  },
  nextDetail: {
    fontSize: PatientDashboardTypography.body,
    color: BrandColors.text,
    lineHeight: 24,
  },
  nextType: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontSize: PatientDashboardTypography.body,
    color: BrandColors.textSecondary,
    lineHeight: 24,
  },
  listSection: {
    gap: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: PatientDashboardTypography.sectionHeading,
    fontWeight: '600',
    color: BrandColors.text,
  },
  list: {
    gap: 12,
  },
  emptyListText: {
    fontSize: PatientDashboardTypography.bodySmall,
    color: BrandColors.textSecondary,
    lineHeight: 22,
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
  },
});
