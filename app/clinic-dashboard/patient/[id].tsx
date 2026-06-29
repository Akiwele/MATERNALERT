import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarPlus, ClipboardPlus } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicDetailRow } from '@/components/clinic/clinic-detail-row';
import { ClinicRiskBadge } from '@/components/clinic/clinic-risk-badge';
import { ClinicSectionHeader } from '@/components/clinic/clinic-section-header';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';
import { formatClinicDate, formatClinicTime } from '@/utils/clinic-date-utils';
import {
  navigateBackFromClinicPatientDetails,
  normalizeRouteParam,
} from '@/utils/clinic-navigation';
import { calculatePregnancyMetrics, formatDisplayDate } from '@/utils/pregnancy-calculations';

export default function ClinicPatientDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const patientId = normalizeRouteParam(id);
  const { getAccessiblePatientById, getPatientAppointments } = useClinicData();

  const patient = patientId ? getAccessiblePatientById(patientId) : undefined;
  const appointments = patient ? getPatientAppointments(patient.id) : [];
  const metrics = patient ? calculatePregnancyMetrics(patient.lmpDate) : null;

  const handleBack = () => {
    navigateBackFromClinicPatientDetails(router);
  };

  if (!patient) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </Pressable>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Patient not found</Text>
          <Text style={styles.emptyText}>This record may not be available to your clinic.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <Text style={styles.name}>{patient.fullName}</Text>
            <ClinicRiskBadge riskStatus={patient.riskStatus} />
          </View>
          <Text style={styles.meta}>Week {patient.currentWeek}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [styles.primaryAction, pressed && styles.actionPressed]}
            onPress={() =>
              router.push({
                pathname: '/clinic-dashboard/record-visit',
                params: { patientId: patient.id },
              })
            }>
            <ClipboardPlus size={18} color={BrandColors.white} />
            <Text style={styles.primaryActionText}>Record Visit</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryAction, pressed && styles.actionPressed]}
            onPress={() =>
              router.push({
                pathname: '/clinic-dashboard/add-appointment',
                params: { patientId: patient.id },
              })
            }>
            <CalendarPlus size={18} color={BrandColors.primaryDark} />
            <Text style={styles.secondaryActionText}>Add Appointment</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <ClinicSectionHeader title="Patient Details" />
          <ClinicDetailRow label="Full Name" value={patient.fullName} />
          <ClinicDetailRow label="Phone Number" value={patient.phoneNumber} />
          <ClinicDetailRow
            label="ANC Book Number"
            value={patient.ancBookNumber ?? 'Not provided'}
          />
          <ClinicDetailRow label="Pregnancy Week" value={`Week ${patient.currentWeek}`} />
          <ClinicDetailRow
            label="EDD"
            value={metrics ? formatDisplayDate(metrics.estimatedDeliveryDate) : 'Not available'}
          />
          <ClinicDetailRow label="Blood Group" value={patient.bloodGroup ?? 'Not recorded'} />
          <ClinicDetailRow label="Allergies" value={patient.allergies || 'None recorded'} />
          <ClinicDetailRow
            label="Existing Medical Conditions"
            value={patient.medicalConditions.join(', ')}
          />
          <ClinicDetailRow
            label="Emergency Contact"
            value={
              patient.emergencyContact
                ? `${patient.emergencyContact.name} (${patient.emergencyContact.relationship}) — ${patient.emergencyContact.phoneNumber}`
                : 'Not provided'
            }
          />
        </View>

        <View style={styles.card}>
          <ClinicSectionHeader title="Recent Vitals & Symptoms" />
          <ClinicDetailRow
            label="Recent Blood Pressure"
            value={
              patient.recentBloodPressure
                ? `${patient.recentBloodPressure.systolic}/${patient.recentBloodPressure.diastolic} mmHg`
                : 'Not recorded'
            }
          />
          <ClinicDetailRow
            label="Recent Weight"
            value={
              patient.recentWeight ? `${patient.recentWeight.valueKg} kg` : 'Not recorded'
            }
          />
          <ClinicDetailRow
            label="Symptoms"
            value={patient.recentSymptoms ?? 'None reported'}
          />
        </View>

        <View style={styles.card}>
          <ClinicSectionHeader title="Appointment History" />
          {appointments.length === 0 ? (
            <Text style={styles.emptyInline}>No appointments recorded.</Text>
          ) : (
            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.historyRow}>
                <Text style={styles.historyTitle}>
                  {formatClinicDate(appointment.date)} · {formatClinicTime(appointment.time)}
                </Text>
                <Text style={styles.historyMeta}>
                  {appointment.visitType} — {appointment.status}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <ClinicSectionHeader title="Visit History" />
          {patient.visits.length === 0 ? (
            <Text style={styles.emptyInline}>No visits recorded yet.</Text>
          ) : (
            patient.visits.map((visit) => (
              <View key={visit.id} style={styles.historyRow}>
                <Text style={styles.historyTitle}>{formatClinicDate(visit.visitDate)}</Text>
                <Text style={styles.historyMeta}>
                  {visit.diagnosis || 'Visit recorded'}
                  {visit.systolic && visit.diastolic
                    ? ` · BP ${visit.systolic}/${visit.diastolic}`
                    : ''}
                  {visit.weightKg ? ` · ${visit.weightKg} kg` : ''}
                </Text>
                {visit.symptoms ? (
                  <Text style={styles.historyNotes}>Symptoms: {visit.symptoms}</Text>
                ) : null}
                {visit.medication ? (
                  <Text style={styles.historyNotes}>Medication: {visit.medication}</Text>
                ) : null}
              </View>
            ))
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
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 16,
  },
  headerCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
    gap: 6,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.text,
  },
  meta: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.white,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  actionPressed: {
    opacity: 0.9,
  },
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  historyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    gap: 4,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.text,
  },
  historyMeta: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  historyNotes: {
    fontSize: 13,
    color: BrandColors.text,
    lineHeight: 18,
  },
  emptyInline: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  emptyText: {
    fontSize: 15,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
});
