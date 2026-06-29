import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicAppointmentListCard } from '@/components/clinic/clinic-appointment-list-card';
import { ClinicSectionHeader } from '@/components/clinic/clinic-section-header';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';

export default function ClinicAppointmentsScreen() {
  const {
    appointments,
    todaysAppointments,
    upcomingAppointments,
    missedAppointments,
    markAppointmentAttended,
    markAppointmentMissed,
    rescheduleAppointment,
  } = useClinicData();

  const handleReschedule = (appointmentId: string) => {
    const appointment = appointments.find((entry) => entry.id === appointmentId);

    if (!appointment) {
      return;
    }

    Alert.alert('Reschedule appointment', 'Move this appointment to one week from the original date?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reschedule',
        onPress: () => {
          const newDate = new Date(appointment.date);
          newDate.setDate(newDate.getDate() + 7);
          rescheduleAppointment(appointmentId, newDate, appointment.time);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Appointments</Text>
          <Text style={styles.subtitle}>Manage today, upcoming, and missed antenatal visits.</Text>
        </View>

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
                  onReschedule={() => handleReschedule(appointment.id)}
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
                  onReschedule={() => handleReschedule(appointment.id)}
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
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
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
