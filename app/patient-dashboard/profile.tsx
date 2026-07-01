import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  Building2,
  CircleHelp,
  FileText,
  HeartHandshake,
  Info,
  KeyRound,
  LifeBuoy,
  Shield,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicSelector } from '@/components/clinic-selector';
import {
  ProfileDetailRow,
  ProfileSectionCard,
} from '@/components/profile/profile-section-card';
import { ProfileNavRow } from '@/components/profile/profile-nav-row';
import { ProfileNavGroup, ProfileToggleRow } from '@/components/profile/profile-settings-rows';
import { BrandColors } from '@/constants/brand';
import { Clinic } from '@/constants/clinics';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '@/stores/notification-settings';
import {
  clearPatientRegistration,
  getPatientRegistration,
  updatePatientClinic,
} from '@/stores/patient-registration';
import { clearPatientProfile, getPatientProfile } from '@/stores/patient-profile';
import { ACCOUNT_TYPE_LOGIN_ROUTES } from '@/types/app-navigation';
import { getSavedAccountType } from '@/utils/account-type-storage';
import { clearAuthSession } from '@/utils/auth-session-storage';
import {
  formatDateOfBirthDisplay,
  formatMedicalConditionsDisplay,
  formatObstetricValueDisplay,
  formatProfileFieldValue,
  formatYesNoDisplay,
} from '@/utils/profile-display';
import { formatDisplayDate } from '@/utils/pregnancy-calculations';
import { syncPatientToCareNetwork, transferPatientToClinic } from '@/utils/sync-patient-care-network';

export default function PatientProfileScreen() {
  const router = useRouter();
  const [, setRefreshKey] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState(getNotificationSettings());
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransferClinic, setSelectedTransferClinic] = useState<Clinic | null>(null);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((current) => current + 1);
      setNotificationSettings(getNotificationSettings());
    }, []),
  );

  const registration = getPatientRegistration();
  const profile = getPatientProfile();

  const displayName = registration?.fullName?.trim() ?? '';

  const handleClinicTransfer = () => {
    Alert.alert(
      'Clinic Transfer',
      'In antenatal care, your pregnancy record travels with you when you move facilities. With your consent, verified clinics can access your record using your name and phone number.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Select New Clinic',
          onPress: () => {
            setSelectedTransferClinic(registration?.clinic ?? null);
            setShowTransferModal(true);
          },
        },
      ],
    );
  };

  const handleConfirmTransfer = () => {
    if (!selectedTransferClinic) {
      Alert.alert('Select a clinic', 'Please choose the facility you are transferring to.');
      return;
    }

    if (selectedTransferClinic.name === registration?.clinic?.name) {
      Alert.alert('Same clinic', 'You are already registered at this clinic.');
      return;
    }

    updatePatientClinic(selectedTransferClinic);
    transferPatientToClinic(selectedTransferClinic.name);
    syncPatientToCareNetwork();
    setShowTransferModal(false);
    setRefreshKey((current) => current + 1);

    Alert.alert(
      'Transfer recorded',
      `${selectedTransferClinic.name} can now access your pregnancy record with your consent.`,
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          clearPatientProfile();
          clearPatientRegistration();
          await clearAuthSession();

          const accountType = await getSavedAccountType();
          router.replace(accountType ? ACCOUNT_TYPE_LOGIN_ROUTES[accountType] : '/patient-login');
        },
      },
    ]);
  };

  const updateToggle = (key: keyof typeof notificationSettings, value: boolean) => {
    const next = updateNotificationSettings({ [key]: value });
    setNotificationSettings({ ...next });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        <ProfileSectionCard
          title="Personal Information"
          actionLabel="Edit"
          onActionPress={() => router.push('/edit-personal-info')}>
          <ProfileDetailRow label="Full Name" value={displayName} />
          <ProfileDetailRow
            label="Phone Number"
            value={formatProfileFieldValue(registration?.phoneNumber)}
          />
          <ProfileDetailRow
            label="Email Address"
            value={formatProfileFieldValue(registration?.email)}
          />
          <ProfileDetailRow label="Date of Birth" value={formatDateOfBirthDisplay(profile?.dateOfBirth)} />
          <ProfileDetailRow
            label="Blood Group"
            value={formatProfileFieldValue(profile?.bloodGroup)}
          />
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Pregnancy Information"
          actionLabel="Edit"
          onActionPress={() => router.push('/edit-pregnancy-profile')}>
          <ProfileDetailRow
            label="Pregnancy Start Date (LMP)"
            value={profile ? formatDisplayDate(profile.lmpDate) : ''}
          />
          <ProfileDetailRow
            label="First Pregnancy"
            value={formatYesNoDisplay(profile?.isFirstPregnancy)}
          />
          <ProfileDetailRow
            label="Previous Pregnancies"
            value={formatObstetricValueDisplay(profile, 'previousPregnancies')}
          />
          <ProfileDetailRow
            label="Number of Living Children"
            value={formatObstetricValueDisplay(profile, 'livingChildren')}
          />
          <ProfileDetailRow
            label="Previous Miscarriages"
            value={formatObstetricValueDisplay(profile, 'previousMiscarriages')}
          />
          <ProfileDetailRow
            label="Previous Induced Abortions"
            value={formatObstetricValueDisplay(profile, 'previousInducedAbortions')}
          />
          <ProfileDetailRow
            label="Previous Stillbirths"
            value={formatObstetricValueDisplay(profile, 'previousStillbirths')}
          />
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Health Information"
          actionLabel="Edit"
          onActionPress={() => router.push('/edit-pregnancy-profile')}>
          <ProfileDetailRow
            label="Height"
            value={profile?.heightCm ? `${profile.heightCm} cm` : ''}
          />
          <ProfileDetailRow
            label="Current Weight"
            value={profile?.weightKg ? `${profile.weightKg} kg` : ''}
          />
          <ProfileDetailRow
            label="Existing Medical Conditions"
            value={formatMedicalConditionsDisplay(profile)}
          />
          <ProfileDetailRow
            label="Allergies"
            value={formatProfileFieldValue(profile?.allergies)}
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Clinic Information">
          <ProfileDetailRow
            label="Registered Clinic Name"
            value={formatProfileFieldValue(registration?.clinic?.name)}
          />
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={handleClinicTransfer}>
            <Building2 size={18} color={BrandColors.primaryDark} />
            <Text style={styles.secondaryButtonText}>Transfer to Another Clinic</Text>
          </Pressable>
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Emergency Contact"
          actionLabel="Edit"
          onActionPress={() => router.push('/edit-emergency-contact')}>
          <ProfileDetailRow
            label="Contact Name"
            value={formatProfileFieldValue(profile?.emergencyContact?.name)}
          />
          <ProfileDetailRow
            label="Relationship"
            value={formatProfileFieldValue(profile?.emergencyContact?.relationship)}
          />
          <ProfileDetailRow
            label="Phone Number"
            value={formatProfileFieldValue(profile?.emergencyContact?.phoneNumber)}
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Notification Settings">
          <ProfileToggleRow
            label="Appointment Reminders"
            description="Get reminded before your antenatal visits."
            value={notificationSettings.appointmentReminders}
            onValueChange={(value) => updateToggle('appointmentReminders', value)}
          />
          <ProfileToggleRow
            label="Pregnancy Tips"
            description="Receive weekly pregnancy education messages."
            value={notificationSettings.pregnancyTips}
            onValueChange={(value) => updateToggle('pregnancyTips', value)}
          />
          <ProfileToggleRow
            label="Risk Alerts"
            description="Be notified about important pregnancy risk updates."
            value={notificationSettings.riskAlerts}
            onValueChange={(value) => updateToggle('riskAlerts', value)}
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Privacy & Security">
          <ProfileNavGroup>
            <ProfileNavRow
              label="Change Password"
              icon={KeyRound}
              onPress={() => router.push('/patient-forgot-password')}
            />
            <ProfileNavRow
              label="Privacy Policy"
              icon={Shield}
              onPress={() => router.push('/profile-content?section=privacy')}
            />
            <ProfileNavRow
              label="Terms & Conditions"
              icon={FileText}
              onPress={() => router.push('/profile-content?section=terms')}
            />
          </ProfileNavGroup>
        </ProfileSectionCard>

        <ProfileSectionCard title="Help & Support">
          <ProfileNavGroup>
            <ProfileNavRow
              label="FAQs"
              icon={CircleHelp}
              onPress={() => router.push('/profile-content?section=faqs')}
            />
            <ProfileNavRow
              label="Contact Support"
              icon={LifeBuoy}
              onPress={() => router.push('/profile-content?section=support')}
            />
            <ProfileNavRow
              label="About MaternAlert"
              icon={Info}
              onPress={() => router.push('/profile-content?section=about')}
            />
          </ProfileNavGroup>
        </ProfileSectionCard>

        <Pressable
          style={({ pressed }) => [styles.signOutButton, pressed && styles.buttonPressed]}
          onPress={handleSignOut}>
          <HeartHandshake size={18} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={showTransferModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTransferModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Transfer to a new clinic</Text>
            <Text style={styles.modalText}>
              Select the verified clinic you are moving to. You consent to share your pregnancy
              record with that facility.
            </Text>
            <ClinicSelector
              selectedClinic={selectedTransferClinic}
              onSelect={setSelectedTransferClinic}
            />
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [styles.modalCancelButton, pressed && styles.buttonPressed]}
                onPress={() => setShowTransferModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalConfirmButton, pressed && styles.buttonPressed]}
                onPress={handleConfirmTransfer}>
                <Text style={styles.modalConfirmText}>Confirm Transfer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  secondaryButton: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
  },
  secondaryButtonText: {
    fontSize: PatientDashboardTypography.body,
    fontWeight: '600',
    color: BrandColors.primaryDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.text,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: BrandColors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalCancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: BrandColors.primary,
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.white,
  },
  signOutButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    backgroundColor: BrandColors.white,
  },
  signOutText: {
    fontSize: PatientDashboardTypography.body,
    fontWeight: '600',
    color: '#DC2626',
  },
  buttonPressed: {
    opacity: 0.88,
  },
});
