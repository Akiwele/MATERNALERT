import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
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
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    textAlign: 'right',
    flex: 1,
  },
  symptomsBlock: {
    gap: 4,
  },
  symptomsValue: {
    fontSize: 14,
    color: BrandColors.text,
    lineHeight: 20,
  },
  notes: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
