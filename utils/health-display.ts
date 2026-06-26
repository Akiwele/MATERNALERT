import type { HealthRecord, HealthSummary } from '@/types/health';

function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function formatHealthRecordDate(value: string): string {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatLastUpdated(value: string | null): string {
  if (!value) {
    return 'Not recorded';
  }

  const date = new Date(value);
  const today = startOfDay(new Date());
  const recordDay = startOfDay(date);

  if (recordDay.getTime() === today.getTime()) {
    return 'Today';
  }

  return formatHealthRecordDate(value);
}

export function formatBloodPressure(systolic: number | null, diastolic: number | null): string {
  if (systolic === null || diastolic === null) {
    return 'Not recorded';
  }

  return `${systolic}/${diastolic} mmHg`;
}

export function formatWeight(weightKg: number | null): string {
  if (weightKg === null) {
    return 'Not recorded';
  }

  return `${weightKg} kg`;
}

export function formatSymptomsList(symptoms: string[]): string {
  if (symptoms.length === 0) {
    return 'None';
  }

  return symptoms.join(', ');
}

export function computeHealthSummary(records: HealthRecord[]): HealthSummary {
  const sorted = [...records].sort(
    (left, right) => new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime(),
  );

  let currentWeightKg: number | null = null;
  let systolic: number | null = null;
  let diastolic: number | null = null;
  let lastUpdatedAt: string | null = null;

  for (const record of sorted) {
    if (lastUpdatedAt === null) {
      lastUpdatedAt = record.recordedAt;
    }

    if (currentWeightKg === null && record.weightKg !== undefined) {
      currentWeightKg = record.weightKg;
    }

    if (systolic === null && record.systolic !== undefined) {
      systolic = record.systolic;
    }

    if (diastolic === null && record.diastolic !== undefined) {
      diastolic = record.diastolic;
    }
  }

  return {
    currentWeightKg,
    systolic,
    diastolic,
    lastUpdatedAt,
  };
}
