import { useRouter } from 'expo-router';
import {
  Activity,
  AlertTriangle,
  Baby,
  Calendar,
  CheckCircle,
  ChevronRight,
  Scale,
} from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmergencyHelpCard } from '@/components/patient-dashboard/emergency-help-card';
import { HealthTrendsCard } from '@/components/patient-dashboard/health-trends-card';
import { HomeStatCard } from '@/components/patient-dashboard/home-stat-card';
import { PregnancyRiskCard } from '@/components/patient-dashboard/pregnancy-risk-card';
import { PatientHomeHero } from '@/components/patient-dashboard/patient-home-hero';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import { getWeeklyPregnancyTip } from '@/constants/weekly-pregnancy-tips';
import { useAppointments } from '@/contexts/appointments-context';
import { useHealth } from '@/contexts/health-context';
import { usePatientData } from '@/contexts/patient-data-context';
import { getPatientDisplayName, getPregnancySummaryDisplay } from '@/utils/patient-dashboard-data';
import {
  formatAppointmentDayDisplay,
  getBpTrendData,
  getCheckInStats,
  getPatientFullName,
  getPatientInitials,
  getWeightTrendData,
  hasBpAlert,
} from '@/utils/patient-home-dashboard';
import { getPregnancyRiskDisplay } from '@/utils/pregnancy-risk';

export default function PatientDashboardHomeScreen() {
  const router = useRouter();
  const { profile } = usePatientData();

  const {
    nextAppointment,
    reminders,
    missedAncWarning,
    hasHighRiskFromMissedAnc,
    missedAncRiskReason,
  } = useAppointments();
  const pregnancyRisk = useMemo(() => getPregnancyRiskDisplay(), [profile, nextAppointment]);
  const { records, summary } = useHealth();
  const pregnancySummary = getPregnancySummaryDisplay();
  const firstName = getPatientDisplayName();
  const fullName = getPatientFullName();
  const initials = getPatientInitials(fullName);
  const bpAlert = hasBpAlert(summary.systolic, summary.diastolic);
  const latestSystolic = summary.systolic;
  const latestDiastolic = summary.diastolic;
  const latestWeight = summary.currentWeightKg;
  const bpTrendData = getBpTrendData(records);
  const weightTrendData = getWeightTrendData(records);
  const checkInStats = getCheckInStats(records);
  const weeklyTip = getWeeklyPregnancyTip(pregnancySummary.currentWeek);
  const appointmentDisplay = nextAppointment
    ? formatAppointmentDayDisplay(nextAppointment)
    : null;
  const todayReminders = reminders.filter((reminder) => reminder.tone === 'today');
  const remainingReminders = reminders.filter((reminder) => reminder.tone !== 'today');

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.heroSafeArea} edges={['top', 'left', 'right']}>
        <PatientHomeHero
          initials={initials}
          firstName={firstName}
          currentWeek={pregnancySummary.currentWeek}
          dueDate={pregnancySummary.estimatedDeliveryDate}
          onProfilePress={() => router.push('/patient-dashboard/profile')}
        />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.summaryGrid}>
          <HomeStatCard
            label="Last BP"
            value={
              latestSystolic !== null && latestDiastolic !== null
                ? `${latestSystolic}/${latestDiastolic}`
                : '—'
            }
            unit="mmHg"
            status={bpAlert ? 'warning' : 'normal'}
            icon={Activity}
          />
          <HomeStatCard
            label="Weight"
            value={latestWeight !== null ? String(latestWeight) : '—'}
            unit="kg"
            status="normal"
            icon={Scale}
          />
          <HomeStatCard
            label="Next Visit"
            value={appointmentDisplay ? `${appointmentDisplay.month} ${appointmentDisplay.day}` : '—'}
            unit={appointmentDisplay ? '· upcoming' : ''}
            status="upcoming"
            icon={Calendar}
          />
          <HomeStatCard
            label="Check-ins"
            value={String(checkInStats.streak)}
            unit={`/ ${checkInStats.total} weeks`}
            status="normal"
            icon={CheckCircle}
          />
        </View>

        <EmergencyHelpCard contact={profile?.emergencyContact} patientName={fullName} />

        {appointmentDisplay ? (
          <Pressable
            style={styles.sectionCard}
            onPress={() => router.push('/patient-dashboard/appointments')}>
            <Text style={styles.sectionTitle}>Next Appointment</Text>
            <View style={styles.appointmentRow}>
              <View style={styles.appointmentDateBadge}>
                <Text style={styles.appointmentDay}>{appointmentDisplay.day}</Text>
                <Text style={styles.appointmentMonth}>{appointmentDisplay.month}</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentLabel}>{appointmentDisplay.label}</Text>
                <Text style={styles.appointmentMeta}>
                  {appointmentDisplay.time} · {appointmentDisplay.provider}
                </Text>
                <Text style={styles.appointmentMeta}>{appointmentDisplay.location}</Text>
              </View>
              <ChevronRight size={16} color={BrandColors.textSecondary} />
            </View>
          </Pressable>
        ) : null}

        {todayReminders.map((reminder) => (
          <View
            key={reminder.id}
            style={[styles.reminderBanner, styles.reminderToday]}>
            <Calendar size={16} color={BrandColors.primaryDark} />
            <View style={styles.alertCopy}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderMessage}>{reminder.message}</Text>
            </View>
          </View>
        ))}

        {remainingReminders.map((reminder) => (
          <View
            key={reminder.id}
            style={[styles.reminderBanner, styles.reminderTomorrow]}>
            <Calendar size={16} color="#0369A1" />
            <View style={styles.alertCopy}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderMessage}>{reminder.message}</Text>
            </View>
          </View>
        ))}

        {missedAncWarning ? (
          <View style={styles.warningBanner}>
            <AlertTriangle size={16} color="#B45309" style={styles.alertIcon} />
            <Text style={styles.warningText}>{missedAncWarning}</Text>
          </View>
        ) : null}

        {hasHighRiskFromMissedAnc && missedAncRiskReason ? (
          <View style={styles.highRiskBanner}>
            <AlertTriangle size={16} color="#DC2626" style={styles.alertIcon} />
            <View style={styles.alertCopy}>
              <Text style={styles.highRiskTitle}>High Risk / Follow-up Needed</Text>
              <Text style={styles.highRiskMessage}>{missedAncRiskReason}</Text>
            </View>
          </View>
        ) : null}

        {bpAlert && latestSystolic !== null && latestDiastolic !== null ? (
          <View style={styles.alertBanner}>
            <AlertTriangle size={16} color="#D97706" style={styles.alertIcon} />
            <View style={styles.alertCopy}>
              <Text style={styles.alertTitle}>Blood pressure alert</Text>
              <Text style={styles.alertMessage}>
                Your last reading ({latestSystolic}/{latestDiastolic} mmHg) was above the safe
                range. Please contact your clinic.
              </Text>
            </View>
          </View>
        ) : null}

        <PregnancyRiskCard risk={pregnancyRisk} />

        <HealthTrendsCard bpData={bpTrendData} weightData={weightTrendData} />

        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Baby size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.tipHeaderText}>{weeklyTip.title}</Text>
          </View>
          <View style={styles.tipBody}>
            <Text style={styles.tipMilestone}>{weeklyTip.milestone}</Text>
            <Pressable
              style={styles.tipLinkRow}
              onPress={() => router.push('/patient-dashboard/education')}>
              <Text style={styles.tipLink}>Read full guidance</Text>
              <ChevronRight size={12} color={BrandColors.primary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  heroSafeArea: {
    backgroundColor: BrandColors.primary,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  alertIcon: {
    marginTop: 2,
  },
  alertCopy: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '600',
    color: '#92400E',
  },
  alertMessage: {
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    color: '#B45309',
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
  highRiskBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  highRiskTitle: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '700',
    color: '#B91C1C',
  },
  highRiskMessage: {
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    color: '#DC2626',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
  },
  sectionTitle: {
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 12,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appointmentDateBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  appointmentDay: {
    color: BrandColors.white,
    fontSize: PatientDashboardTypography.body,
    fontWeight: '700',
    lineHeight: 18,
  },
  appointmentMonth: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: PatientDashboardTypography.captionSmall,
    fontWeight: '500',
    lineHeight: 13,
    marginTop: 2,
  },
  appointmentDetails: {
    flex: 1,
    gap: 2,
  },
  appointmentLabel: {
    fontSize: PatientDashboardTypography.body,
    fontWeight: '500',
    color: BrandColors.text,
  },
  appointmentMeta: {
    fontSize: PatientDashboardTypography.caption,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  tipCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: 'hidden',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tipHeaderText: {
    flex: 1,
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '600',
    color: BrandColors.white,
  },
  tipBody: {
    backgroundColor: BrandColors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tipMilestone: {
    fontSize: PatientDashboardTypography.bodySmall,
    lineHeight: 22,
    color: BrandColors.textSecondary,
  },
  tipLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  tipLink: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '500',
    color: BrandColors.primary,
  },
});
