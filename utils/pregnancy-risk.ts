import { getRiskStatusFromConditions } from '@/constants/medical-conditions';
import { getAncAppointmentsForPhone } from '@/stores/anc-appointments-store';
import { getPatientProfile } from '@/stores/patient-profile';
import { getPatientPhoneForAppointments } from '@/utils/appointment-patient-view';
import {
  countConsecutiveMissedAncAppointments,
  MISSED_TWO_CONSECUTIVE_REASON,
} from '@/utils/anc-risk-rules';
import { formatMedicalConditionsList } from '@/utils/profile-display';

export type PregnancyRiskLevel = 'Low Risk' | 'High Risk';

export type PregnancyRiskDisplay = {
  status: PregnancyRiskLevel;
  headline: string;
  reason: string;
};

const LOW_RISK_REASON = 'No current pregnancy risks detected.';

export function getPregnancyRiskDisplay(): PregnancyRiskDisplay {
  const profile = getPatientProfile();
  const clinicAppointments = getAncAppointmentsForPhone(getPatientPhoneForAppointments());
  const consecutiveMissed = countConsecutiveMissedAncAppointments(clinicAppointments);

  if (consecutiveMissed >= 2) {
    return {
      status: 'High Risk',
      headline: 'High Risk / Follow-up Needed',
      reason: MISSED_TWO_CONSECUTIVE_REASON,
    };
  }

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

  const conditionLabels = formatMedicalConditionsList(
    profile.medicalConditions,
    profile.otherConditionDetails,
  );

  return {
    status: 'High Risk',
    headline: 'High Risk Pregnancy',
    reason: conditionLabels
      ? `High risk due to: ${conditionLabels}`
      : 'High risk due to existing medical conditions.',
  };
}
