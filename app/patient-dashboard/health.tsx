import { Activity, Pill, Scale, Thermometer } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HealthActionCard } from '@/components/health/health-action-card';
import { HealthRecordCard } from '@/components/health/health-record-card';
import {
  LogHealthRecordModal,
  type HealthLogFocusSection,
  type LogHealthRecordModalMode,
} from '@/components/health/log-health-record-modal';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import { useHealth } from '@/contexts/health-context';
import {
  formatBloodPressure,
  formatHealthRecordDate,
  formatLastUpdated,
  formatWeight,
} from '@/utils/health-display';

const HEALTH_ACTIONS: {
  id: HealthLogFocusSection;
  label: string;
  icon: typeof Activity;
}[] = [
  { id: 'bloodPressure', label: '🩸 Blood Pressure', icon: Activity },
  { id: 'weight', label: '⚖️ Weight', icon: Scale },
  { id: 'symptoms', label: '🤒 Symptoms', icon: Thermometer },
  { id: 'medication', label: '💊 Medications', icon: Pill },
];

export default function PatientHealthScreen() {
  const { records, medications, summary, saveHealthRecord } = useHealth();
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);
  const [logModalMode, setLogModalMode] = useState<LogHealthRecordModalMode>('full');

  const openFullLogModal = () => {
    setLogModalMode('full');
    setIsLogModalVisible(true);
  };

  const openQuickActionModal = (section: HealthLogFocusSection) => {
    setLogModalMode(section);
    setIsLogModalVisible(true);
  };

  const closeLogModal = () => {
    setIsLogModalVisible(false);
    setLogModalMode('full');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Health</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Health Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Weight:</Text>
            <Text style={styles.summaryValue}>{formatWeight(summary.currentWeightKg)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Blood Pressure:</Text>
            <Text style={styles.summaryValue}>
              {formatBloodPressure(summary.systolic, summary.diastolic)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Last Updated:</Text>
            <Text style={styles.summaryValue}>{formatLastUpdated(summary.lastUpdatedAt)}</Text>
          </View>
        </View>

        <PrimaryButton label="Log Health Record" onPress={openFullLogModal} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Health Actions</Text>
          <View style={styles.actionsGrid}>
            {HEALTH_ACTIONS.map((action) => (
              <HealthActionCard
                key={action.id}
                label={action.label}
                icon={action.icon}
                onPress={() => openQuickActionModal(action.id)}
              />
            ))}
          </View>
        </View>

        {medications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
            <View style={styles.list}>
              {medications.map((medication) => (
                <View key={medication.id} style={styles.medicationCard}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDetail}>
                    {medication.dosage} • {medication.frequency}
                  </Text>
                  <Text style={styles.medicationMeta}>
                    Started {formatHealthRecordDate(medication.startDate)}
                  </Text>
                  {medication.notes?.trim() ? (
                    <Text style={styles.medicationNotes}>{medication.notes.trim()}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Health Records</Text>

          {records.length > 0 ? (
            <View style={styles.list}>
              {records.map((record) => (
                <HealthRecordCard key={record.id} record={record} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No health records yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <LogHealthRecordModal
        visible={isLogModalVisible}
        mode={logModalMode}
        initialWeight={summary.currentWeightKg}
        onClose={closeLogModal}
        onSave={saveHealthRecord}
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
    paddingBottom: 32,
    gap: 16,
  },
  pageHeader: {
    marginTop: 4,
    marginBottom: 4,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: PatientDashboardTypography.greeting,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    gap: 10,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '700',
    color: BrandColors.primaryDark,
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  summaryLabel: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  summaryValue: {
    fontSize: PatientDashboardTypography.body,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'right',
    flex: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: PatientDashboardTypography.sectionHeading,
    fontWeight: '600',
    color: BrandColors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  list: {
    gap: 12,
  },
  medicationCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 4,
  },
  medicationName: {
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '700',
    color: BrandColors.text,
  },
  medicationDetail: {
    fontSize: PatientDashboardTypography.bodySmall,
    color: BrandColors.text,
    lineHeight: 22,
  },
  medicationMeta: {
    fontSize: PatientDashboardTypography.caption,
    color: BrandColors.textSecondary,
  },
  medicationNotes: {
    fontSize: PatientDashboardTypography.caption,
    color: BrandColors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: BrandColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: PatientDashboardTypography.body,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
});
