import { useRouter } from 'expo-router';
import { Bell, Hospital, Siren, TriangleAlert } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DashboardCard } from '@/components/patient-dashboard/dashboard-card';
import { BrandColors } from '@/constants/brand';
import { useAppointments } from '@/contexts/appointments-context';
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from '@/utils/appointments';
import {
  getPatientDisplayName,
  getPregnancySummaryDisplay,
} from '@/utils/patient-dashboard-data';
import { getTimeGreeting } from '@/utils/pregnancy-calculations';

const QUICK_ACTIONS = [
  { id: 'emergency', label: 'Emergency Help', icon: Siren, route: '/patient-dashboard/health' },
  { id: 'clinic', label: 'My Clinic', icon: Hospital, route: '/patient-dashboard/profile' },
  { id: 'risk-alerts', label: 'Risk Alerts', icon: TriangleAlert, route: '/patient-dashboard/health' },
  { id: 'notifications', label: 'Notifications', icon: Bell, route: '/patient-dashboard/profile' },
] as const;

const TOTAL_PREGNANCY_WEEKS = 40;

const WEEK_TIP_TEXT =
  'Eat iron-rich foods and drink plenty of water today.';

const BABY_THIS_WEEK_TEXT =
  'Your baby is growing steadily. Keep attending antenatal visits and following clinic advice.';

export default function PatientDashboardHomeScreen() {
  const router = useRouter();
  const { nextAppointment } = useAppointments();
  const greeting = getTimeGreeting();
  const firstName = getPatientDisplayName();
  const summary = getPregnancySummaryDisplay();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>
            {greeting}, {firstName} 👋
          </Text>
        </View>

        <DashboardCard title="Pregnancy Summary">
          <Text style={styles.summaryHeadline}>
            Week {summary.currentWeek} • {summary.trimesterDisplay}
          </Text>
          <Text style={styles.summaryLine}>EDD: {summary.estimatedDeliveryDate}</Text>
          <Text style={styles.summaryLine}>
            {summary.weeksRemaining} weeks remaining
          </Text>
          <Text style={styles.summaryHighlight}>{summary.progressPercent}% Complete</Text>

          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>
              Week {summary.currentWeek} of {TOTAL_PREGNANCY_WEEKS}
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${summary.progressPercent}%` }]} />
            </View>
          </View>
        </DashboardCard>

        <DashboardCard
          title="Risk Status"
          highlight={summary.riskStatus === 'High Risk'}>
          <Text
            style={[
              styles.riskHeadline,
              summary.riskStatus === 'High Risk' ? styles.riskHighText : styles.riskLowText,
            ]}>
            {summary.riskStatus === 'High Risk' ? 'High Risk Pregnancy' : 'Low Risk Pregnancy'}
          </Text>
          {summary.riskStatus === 'High Risk' && summary.riskReason ? (
            <View style={styles.riskReasonBlock}>
              <Text style={styles.riskReasonLabel}>Reason:</Text>
              <Text style={styles.riskReason}>{summary.riskReason}</Text>
            </View>
          ) : (
            <Text style={styles.riskNote}>{summary.lowRiskMessage}</Text>
          )}
        </DashboardCard>

        <DashboardCard title="Next Antenatal Appointment">
          {nextAppointment ? (
            <View style={styles.nextAppointmentBlock}>
              <Text style={styles.nextAppointmentClinic}>{nextAppointment.clinicName}</Text>
              <Text style={styles.nextAppointmentLine}>
                {formatAppointmentDate(nextAppointment.appointmentDate)}
              </Text>
              <Text style={styles.nextAppointmentLine}>
                {formatAppointmentTime(nextAppointment.appointmentTime)}
              </Text>
              <Text style={styles.nextAppointmentType}>{nextAppointment.appointmentType}</Text>
            </View>
          ) : (
            <Text style={styles.appointmentText}>No appointment scheduled yet.</Text>
          )}
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/patient-dashboard/appointments')}>
            <Text style={styles.secondaryButtonText}>View Appointments</Text>
          </Pressable>
        </DashboardCard>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;

              return (
                <Pressable
                  key={action.id}
                  style={styles.quickActionCard}
                  onPress={() => router.push(action.route)}>
                  <View style={styles.quickActionIcon}>
                    <Icon size={22} color={BrandColors.primary} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <DashboardCard title={`Week ${summary.currentWeek} Tip`}>
          <Text style={styles.tipText}>{WEEK_TIP_TEXT}</Text>
        </DashboardCard>

        <DashboardCard title="Baby This Week">
          <Text style={styles.tipText}>{BABY_THIS_WEEK_TEXT}</Text>
        </DashboardCard>
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
  greeting: {
    marginTop: 4,
    marginBottom: 4,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  summaryHeadline: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  summaryLine: {
    fontSize: 15,
    color: BrandColors.text,
    lineHeight: 22,
  },
  summaryHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
    marginTop: 2,
  },
  progressSection: {
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.border,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  progressTrack: {
    height: 10,
    backgroundColor: BrandColors.primaryLight,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BrandColors.primary,
    borderRadius: 999,
  },
  riskHeadline: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  riskLowText: {
    color: BrandColors.primaryDark,
  },
  riskHighText: {
    color: '#B91C1C',
  },
  riskReasonBlock: {
    gap: 4,
  },
  riskReasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  riskReason: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
  },
  riskNote: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
  },
  appointmentText: {
    fontSize: 15,
    color: BrandColors.textSecondary,
  },
  nextAppointmentBlock: {
    gap: 4,
  },
  nextAppointmentClinic: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primaryDark,
    lineHeight: 22,
  },
  nextAppointmentLine: {
    fontSize: 15,
    color: BrandColors.text,
    lineHeight: 22,
  },
  nextAppointmentType: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  secondaryButton: {
    marginTop: 4,
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
  quickActionsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.text,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    minHeight: 88,
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    lineHeight: 18,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.text,
  },
});
