import { getRiskStatusFromConditions } from '@/constants/medical-conditions';
import { getPatientProfile, type PatientProfile } from '@/stores/patient-profile';

export type PregnancyRiskLevel = 'Low Risk' | 'High Risk';

export type PregnancyRiskDisplay = {
  status: PregnancyRiskLevel;
  headline: string;
  reason: string;
};

const LOW_RISK_REASON = 'No current pregnancy risks detected.';

function formatHighRiskConditionLabels(profile: PatientProfile): string {
  return profile.medicalConditions
    .filter((condition) => condition !== 'None')
    .map((condition) => {
      if (condition === 'Other' && profile.otherConditionDetails.trim()) {
        return profile.otherConditionDetails.trim();
      }

      return condition;
    })
    .join(', ');
}

export function getPregnancyRiskDisplay(): PregnancyRiskDisplay {
  const profile = getPatientProfile();

  if (!profile || profile.medicalConditions.length === 0) {
    return {
      status: 'Low Risk',
      headline: 'Low Risk Pregnancy',
      reason: LOW_RISK_REASON,
    };
  }

  const isHighRisk = getRiskStatusFromConditions(profile.medicalConditions) === 'High Risk';

  if (!isHighRisk) {
    return {
      status: 'Low Risk',
      headline: 'Low Risk Pregnancy',
      reason: LOW_RISK_REASON,
    };
  }

  const conditionLabels = formatHighRiskConditionLabels(profile);

  return {
    status: 'High Risk',
    headline: 'High Risk Pregnancy',
    reason: conditionLabels
      ? `High risk due to: ${conditionLabels}`
      : 'High risk due to existing medical conditions.',
  };
}
