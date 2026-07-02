import { getPatientRegistration } from '@/stores/patient-registration';
import { PatientProfile, getPatientProfile } from '@/stores/patient-profile';
import {
  calculatePregnancyMetrics,
  formatDisplayDate,
  formatTrimesterDisplay,
  getPregnancyProgress,
  getWeeksRemaining,
} from '@/utils/pregnancy-calculations';
import { getPregnancyRiskDisplay } from '@/utils/pregnancy-risk';
import { formatBmiDisplay } from '@/utils/profile-display';

export type PatientDashboardData = {
  firstName: string;
  profile: PatientProfile;
  currentWeek: number;
  currentDays: number;
  trimester: string;
  trimesterDisplay: string;
  estimatedDeliveryDate: string;
  weeksRemaining: number;
  progressPercent: number;
  riskStatus: 'Low Risk' | 'High Risk';
  riskReason: string | null;
  bmi: string;
  currentWeight: string;
  bloodGroup: string;
};

export type PregnancySummaryDisplay = {
  currentWeek: number;
  trimesterDisplay: string;
  estimatedDeliveryDate: string;
  weeksRemaining: number;
  progressPercent: number;
  riskStatus: 'Low Risk' | 'High Risk';
  riskReason: string | null;
  lowRiskMessage: string;
};

const PLACEHOLDER_SUMMARY: PregnancySummaryDisplay = {
  currentWeek: 18,
  trimesterDisplay: 'Second Trimester',
  estimatedDeliveryDate: '12 October 2026',
  weeksRemaining: 22,
  progressPercent: 45,
  riskStatus: 'Low Risk',
  riskReason: null,
  lowRiskMessage: 'No current pregnancy risks detected.',
};

export function getPatientDisplayName(): string {
  const registration = getPatientRegistration();
  if (registration?.fullName) {
    return registration.fullName.split(/\s+/)[0];
  }

  return 'Stacy';
}

export function getPatientDashboardData(): PatientDashboardData | null {
  const profile = getPatientProfile();
  if (!profile) {
    return null;
  }

  const metrics = calculatePregnancyMetrics(profile.lmpDate);
  const pregnancyRisk = getPregnancyRiskDisplay();
  const isHighRisk = pregnancyRisk.status === 'High Risk';

  return {
    firstName: getPatientDisplayName(),
    profile,
    currentWeek: metrics.weeks,
    currentDays: metrics.days,
    trimester: metrics.trimester,
    trimesterDisplay: formatTrimesterDisplay(metrics.trimester),
    estimatedDeliveryDate: formatDisplayDate(metrics.estimatedDeliveryDate),
    weeksRemaining: getWeeksRemaining(metrics),
    progressPercent: getPregnancyProgress(metrics),
    riskStatus: isHighRisk ? 'High Risk' : 'Low Risk',
    riskReason: isHighRisk ? pregnancyRisk.reason : null,
    bmi: formatBmiDisplay(profile.bmi),
    currentWeight: `${profile.weightKg} kg`,
    bloodGroup: profile.bloodGroup ?? 'Not provided',
  };
}

export function getPregnancySummaryDisplay(): PregnancySummaryDisplay {
  const data = getPatientDashboardData();

  if (!data) {
    return PLACEHOLDER_SUMMARY;
  }

  return {
    currentWeek: data.currentWeek,
    trimesterDisplay: data.trimesterDisplay,
    estimatedDeliveryDate: data.estimatedDeliveryDate,
    weeksRemaining: data.weeksRemaining,
    progressPercent: data.progressPercent,
    riskStatus: data.riskStatus,
    riskReason: data.riskReason,
    lowRiskMessage: getPregnancyRiskDisplay().reason,
  };
}
