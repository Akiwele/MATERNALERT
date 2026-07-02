export type PregnancyMetrics = {
  weeks: number;
  days: number;
  trimester: string;
  estimatedDeliveryDate: Date;
};

export function calculatePregnancyMetrics(lmpDate: Date): PregnancyMetrics {
  const today = startOfDay(new Date());
  const lmp = startOfDay(lmpDate);

  const diffDays = Math.max(0, Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24)));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  let trimester = '1st Trimester';
  if (weeks >= 28) {
    trimester = '3rd Trimester';
  } else if (weeks >= 14) {
    trimester = '2nd Trimester';
  }

  const estimatedDeliveryDate = new Date(lmp);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 280);

  return {
    weeks,
    days,
    trimester,
    estimatedDeliveryDate,
  };
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function calculateBmi(heightCm?: number | null, weightKg?: number | null): number | null {
  if (
    heightCm === undefined ||
    heightCm === null ||
    weightKg === undefined ||
    weightKg === null ||
    !Number.isFinite(heightCm) ||
    !Number.isFinite(weightKg)
  ) {
    return null;
  }

  if (heightCm <= 0 || weightKg <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getWeeksRemaining(metrics: PregnancyMetrics): number {
  return Math.max(0, 40 - metrics.weeks);
}

export function getPregnancyProgress(metrics: PregnancyMetrics): number {
  const totalDays = 280;
  const elapsedDays = metrics.weeks * 7 + metrics.days;
  return Math.min(100, Math.round((elapsedDays / totalDays) * 100));
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 17) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
}

export function formatTrimesterDisplay(trimester: string): string {
  if (trimester === '1st Trimester') return 'First Trimester';
  if (trimester === '2nd Trimester') return 'Second Trimester';
  if (trimester === '3rd Trimester') return 'Third Trimester';
  return trimester;
}

function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}
