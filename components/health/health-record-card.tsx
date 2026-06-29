import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { HealthRecord } from '@/types/health';
import {
  formatHealthRecordDate,
  formatSymptomsList,
  formatWeight,
} from '@/utils/health-display';

type HealthRecordCardProps = {
  record: HealthRecord;
};

export function HealthRecordCard({ record }: HealthRecordCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formatHealthRecordDate(record.recordedAt)}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Weight:</Text>
        <Text style={styles.value}>{formatWeight(record.weightKg ?? null)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Blood Pressure:</Text>
        <Text style={styles.value}>
          {record.systolic !== undefined && record.diastolic !== undefined
            ? `${record.systolic}/${record.diastolic}`
            : 'Not recorded'}
        </Text>
      </View>

      <View style={styles.symptomsBlock}>
        <Text style={styles.label}>Symptoms:</Text>
        <Text style={styles.symptomsValue}>{formatSymptomsList(record.symptoms)}</Text>
        {record.symptomNotes?.trim() ? (
          <Text style={styles.notes}>{record.symptomNotes.trim()}</Text>
        ) : null}
      </View>

      {record.medication ? (
        <View style={styles.medicationBlock}>
          <Text style={styles.label}>Medication:</Text>
          <Text style={styles.value}>
            {record.medication.name} • {record.medication.dosage} • {record.medication.frequency}
          </Text>
          {record.medication.notes?.trim() ? (
            <Text style={styles.notes}>{record.medication.notes.trim()}</Text>
          ) : null}
        </View>
      ) : null}

      {record.notes?.trim() ? (
        <View style={styles.notesBlock}>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.notes}>{record.notes.trim()}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 10,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  date: {
    fontSize: PatientDashboardTypography.body,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: PatientDashboardTypography.label,
    color: BrandColors.textSecondary,
    fontWeight: '600',
  },
  value: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.text,
    textAlign: 'right',
    flex: 1,
  },
  symptomsBlock: {
    gap: 4,
  },
  medicationBlock: {
    gap: 4,
  },
  notesBlock: {
    gap: 4,
  },
  symptomsValue: {
    fontSize: PatientDashboardTypography.label,
    color: BrandColors.text,
    lineHeight: 22,
  },
  notes: {
    fontSize: PatientDashboardTypography.caption,
    color: BrandColors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
