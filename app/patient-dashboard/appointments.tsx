import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddAppointmentModal } from '@/components/appointments/add-appointment-modal';
import { AppointmentListItem } from '@/components/appointments/appointment-list-item';
import { AppointmentStatusBadge } from '@/components/appointments/appointment-status-badge';
import { PrimaryButton } from '@/components/primary-button';
import { DashboardCard } from '@/components/patient-dashboard/dashboard-card';
import { BrandColors } from '@/constants/brand';
import { useAppointments } from '@/contexts/appointments-context';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  getAppointmentStatus,
} from '@/utils/appointments';

export default function PatientAppointmentsScreen() {
  const { sortedAppointments, nextAppointment, addAppointment, markAppointmentCompleted } =
    useAppointments();
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Antenatal Appointments</Text>
          <Text style={styles.subtitle}>
            Track your clinic visits and never miss an appointment.
          </Text>
        </View>

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
            <Text style={styles.emptyText}>No appointment scheduled yet.</Text>
          )}
        </DashboardCard>

        <PrimaryButton label="Add Appointment" onPress={() => setIsModalVisible(true)} />

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>

          {sortedAppointments.length > 0 ? (
            <View style={styles.list}>
              {sortedAppointments.map((appointment) => (
                <AppointmentListItem
                  key={appointment.id}
                  appointment={appointment}
                  onMarkCompleted={markAppointmentCompleted}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyListText}>No appointments added yet.</Text>
          )}
        </View>
      </ScrollView>

      <AddAppointmentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={addAppointment}
      />
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
  header: {
    gap: 6,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.textSecondary,
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
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.primaryDark,
    lineHeight: 24,
  },
  nextDetail: {
    fontSize: 15,
    color: BrandColors.text,
    lineHeight: 22,
  },
  nextType: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 15,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  listSection: {
    gap: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.text,
  },
  list: {
    gap: 12,
  },
  emptyListText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
  },
});
