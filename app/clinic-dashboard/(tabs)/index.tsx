import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicActivityItem } from '@/components/clinic/clinic-activity-item';
import { ClinicDashboardAppointmentRow } from '@/components/clinic/clinic-dashboard-appointment-row';
import { ClinicHighRiskAlertCard } from '@/components/clinic/clinic-high-risk-alert-card';
import { ClinicSectionHeader } from '@/components/clinic/clinic-section-header';
import { ClinicStatCard } from '@/components/clinic/clinic-stat-card';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';

export default function ClinicDashboardHomeScreen() {
  const { clinicName, stats, todaysAppointments, highRiskAlerts, missedAppointments, activities } =
    useClinicData();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.clinicName}>{clinicName}</Text>
          <Text style={styles.dashboardLabel}>Clinic Dashboard</Text>
        </View>

        <View style={styles.statsGrid}>
          <ClinicStatCard label="Today's Appointments" value={stats.todaysAppointments} />
          <ClinicStatCard label="Registered Patients" value={stats.registeredPatients} />
          <ClinicStatCard
            label="High-Risk Pregnancies"
            value={stats.highRiskPregnancies}
            accentColor="#DC2626"
          />
          <ClinicStatCard
            label="Missed Appointments"
            value={stats.missedAppointments}
            accentColor="#B45309"
          />
        </View>

        <View style={styles.sectionCard}>
          <ClinicSectionHeader title="Today's Appointments" />
          {todaysAppointments.length === 0 ? (
            <Text style={styles.emptyText}>No appointments scheduled for today.</Text>
          ) : (
            todaysAppointments.map((appointment) => (
              <ClinicDashboardAppointmentRow key={appointment.id} appointment={appointment} />
            ))
          )}
        </View>

        <View style={styles.sectionCard}>
          <ClinicSectionHeader title="Missed Appointment Alerts" />
          {missedAppointments.length === 0 ? (
            <Text style={styles.emptyText}>No missed appointments to review.</Text>
          ) : (
            <View style={styles.alertList}>
              {missedAppointments.slice(0, 5).map((appointment) => (
                <View key={appointment.id} style={styles.missedRow}>
                  <Text style={styles.missedName}>{appointment.patientName}</Text>
                  <Text style={styles.missedMeta}>
                    {appointment.visitType} · missed visit
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <ClinicSectionHeader title="High-Risk Alerts" />
          {highRiskAlerts.length === 0 ? (
            <Text style={styles.emptyText}>No high-risk alerts at this time.</Text>
          ) : (
            <View style={styles.alertList}>
              {highRiskAlerts.slice(0, 5).map((alert) => (
                <ClinicHighRiskAlertCard key={alert.id} alert={alert} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <ClinicSectionHeader title="Recent Activities" />
          {activities.slice(0, 6).map((activity) => (
            <ClinicActivityItem key={activity.id} activity={activity} />
          ))}
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
    gap: 16,
  },
  header: {
    gap: 4,
  },
  clinicName: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  dashboardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  alertList: {
    gap: 10,
  },
  missedRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    gap: 2,
  },
  missedName: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
  },
  missedMeta: {
    fontSize: 13,
    color: '#B45309',
  },
  emptyText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
  },
});
