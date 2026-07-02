import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicAppointmentListCard } from '@/components/clinic/clinic-appointment-list-card';
import { ClinicRescheduleModal } from '@/components/clinic/clinic-reschedule-modal';
import { ClinicSectionHeader } from '@/components/clinic/clinic-section-header';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';
import { useClinicRescheduleModal } from '@/hooks/use-clinic-reschedule-modal';

export default function ClinicAppointmentsScreen() {
  const router = useRouter();
  const {
    todaysAppointments,
    upcomingAppointments,
    missedAppointments,
    rescheduleRequestedAppointments,
    markAppointmentAttended,
    markAppointmentMissed,
  } = useClinicData();

  const { openReschedule, rescheduleModalProps } = useClinicRescheduleModal();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Appointments</Text>
        </View>

        <PrimaryButton
          label="Add Appointment"
          onPress={() => router.push('/clinic-dashboard/add-appointment')}
        />

        {rescheduleRequestedAppointments.length > 0 ? (
          <View style={styles.section}>
            <ClinicSectionHeader title="Reschedule Requests" />
            <View style={styles.list}>
              {rescheduleRequestedAppointments.map((appointment) => (
                <ClinicAppointmentListCard
                  key={appointment.id}
                  appointment={appointment}
                  onMarkMissed={() => markAppointmentMissed(appointment.id)}
                  onReschedule={() => openReschedule(appointment)}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <ClinicSectionHeader title="Today" />
          {todaysAppointments.length === 0 ? (
            <Text style={styles.emptyText}>No appointments today.</Text>
          ) : (
            <View style={styles.list}>
              {todaysAppointments.map((appointment) => (
                <ClinicAppointmentListCard
                  key={appointment.id}
                  appointment={appointment}
                  onMarkAttended={() => markAppointmentAttended(appointment.id)}
                  onMarkMissed={() => markAppointmentMissed(appointment.id)}
                  onReschedule={() => openReschedule(appointment)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ClinicSectionHeader title="Upcoming" />
          {upcomingAppointments.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming appointments.</Text>
          ) : (
            <View style={styles.list}>
              {upcomingAppointments.map((appointment) => (
                <ClinicAppointmentListCard
                  key={appointment.id}
                  appointment={appointment}
                  onMarkAttended={() => markAppointmentAttended(appointment.id)}
                  onMarkMissed={() => markAppointmentMissed(appointment.id)}
                  onReschedule={() => openReschedule(appointment)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ClinicSectionHeader title="Missed" />
          {missedAppointments.length === 0 ? (
            <Text style={styles.emptyText}>No missed appointments.</Text>
          ) : (
            <View style={styles.list}>
              {missedAppointments.map((appointment) => (
                <ClinicAppointmentListCard
                  key={appointment.id}
                  appointment={appointment}
                  showActions={false}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <ClinicRescheduleModal {...rescheduleModalProps} />
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
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  section: {
    gap: 10,
  },
  list: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
  },
});
