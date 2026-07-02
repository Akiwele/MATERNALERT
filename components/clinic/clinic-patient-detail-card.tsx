import { Phone, ShieldCheck, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import type { CareNetworkPatient } from '@/types/clinic-patient';
import { clinicHasRecordAccess } from '@/utils/clinic-patient-search';

type ClinicPatientDetailCardProps = {
  patient: CareNetworkPatient;
  clinicName: string;
  onRequestAccess: () => void;
  onClose: () => void;
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Icon size={16} color={BrandColors.primary} />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ClinicPatientDetailCard({
  patient,
  clinicName,
  onRequestAccess,
  onClose,
}: ClinicPatientDetailCardProps) {
  const hasAccess = clinicHasRecordAccess(patient, clinicName);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Record</Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        Records are shared across verified clinics with patient consent, similar to an ANC book when
        women transfer between facilities.
      </Text>

      <DetailRow icon={UserRound} label="Full Name" value={patient.fullName} />
      <DetailRow icon={Phone} label="Phone Number" value={patient.phoneNumber} />

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Registered Clinic</Text>
        <Text style={styles.infoValue}>{patient.registeredClinicName}</Text>
      </View>

      {hasAccess ? (
        <View style={styles.accessGranted}>
          <ShieldCheck size={18} color={BrandColors.primaryDark} />
          <View style={styles.accessContent}>
            <Text style={styles.accessTitle}>Continuity of care active</Text>
            <Text style={styles.accessText}>
              {patient.fullName} has granted {clinicName} access to this pregnancy record.
            </Text>
            {patient.currentWeek ? (
              <Text style={styles.accessMeta}>Current week: {patient.currentWeek}</Text>
            ) : null}
            {patient.riskStatus ? (
              <Text style={styles.accessMeta}>Risk status: {patient.riskStatus}</Text>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.accessPending}>
          <Text style={styles.accessTitle}>Patient consent required</Text>
          <Text style={styles.accessText}>
            Request access so the patient can approve sharing their ANC record with {clinicName}.
            They can also grant access when transferring clinics in the MaternAlert app.
          </Text>
          <PrimaryButton label="Request Record Access" onPress={onRequestAccess} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 18,
    gap: 14,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.text,
  },
  closeText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailContent: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
  },
  infoBlock: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
  },
  accessGranted: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
  },
  accessPending: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  accessContent: {
    flex: 1,
    gap: 4,
  },
  accessTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.text,
  },
  accessText: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
  },
  accessMeta: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
});
