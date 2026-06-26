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
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ProfileDetailRow,
  ProfileSectionCard,
} from '@/components/profile/profile-section-card';
import { ProfileNavRow } from '@/components/profile/profile-nav-row';
import { ProfileNavGroup, ProfileToggleRow } from '@/components/profile/profile-settings-rows';
import { BrandColors } from '@/constants/brand';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '@/stores/notification-settings';
import {
  clearPatientRegistration,
  getPatientRegistration,
} from '@/stores/patient-registration';
import { clearPatientProfile, getPatientProfile } from '@/stores/patient-profile';
import { getPregnancySummaryDisplay } from '@/utils/patient-dashboard-data';
import {
  formatDateOfBirth,
  formatMedicalConditions,
  formatObstetricValue,
  formatProfileValue,
  formatYesNo,
} from '@/utils/profile-display';
import { formatDisplayDate } from '@/utils/pregnancy-calculations';

export default function PatientProfileScreen() {
  const router = useRouter();
  const [, setRefreshKey] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState(getNotificationSettings());

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((current) => current + 1);
      setNotificationSettings(getNotificationSettings());
    }, []),
  );

  const registration = getPatientRegistration();
  const profile = getPatientProfile();
  const summary = getPregnancySummaryDisplay();

  const fullName = registration?.fullName ?? 'Not provided';
  const pregnancyWeekLine = `Week ${summary.currentWeek}`;

  const handleClinicTransfer = () => {
    Alert.alert(
      'Request Clinic Transfer',
      'Your clinic transfer request will be reviewed by the MaternAlert team. This feature will be available soon.',
    );
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          clearPatientProfile();
          clearPatientRegistration();
          router.replace('/choose-account-type');
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

        <View style={styles.profileHeaderCard}>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileMeta}>{pregnancyWeekLine}</Text>
        </View>

        <ProfileSectionCard
          title="Personal Information"
          actionLabel="Edit"
          onActionPress={() => router.push('/edit-personal-info')}>
          <ProfileDetailRow label="Full Name" value={fullName} />
          <ProfileDetailRow
            label="Phone Number"
            value={formatProfileValue(registration?.phoneNumber)}
          />
          <ProfileDetailRow
            label="Email Address"
            value={formatProfileValue(registration?.email)}
          />
          <ProfileDetailRow label="Date of Birth" value={formatDateOfBirth(profile?.dateOfBirth)} />
          <ProfileDetailRow
            label="Blood Group"
            value={formatProfileValue(profile?.bloodGroup)}
          />
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Pregnancy Information"
          actionLabel="Edit Pregnancy Information"
          onActionPress={() => router.push('/edit-pregnancy-profile')}>
          <ProfileDetailRow
            label="Pregnancy Start Date (LMP)"
            value={profile ? formatDisplayDate(profile.lmpDate) : 'Not provided'}
          />
          <ProfileDetailRow
            label="First Pregnancy"
            value={formatYesNo(profile?.isFirstPregnancy)}
          />
          <ProfileDetailRow
            label="Previous Pregnancies"
            value={formatObstetricValue(profile, 'previousPregnancies')}
          />
          <ProfileDetailRow
            label="Number of Living Children"
            value={formatObstetricValue(profile, 'livingChildren')}
          />
          <ProfileDetailRow
            label="Previous Miscarriages"
            value={formatObstetricValue(profile, 'previousMiscarriages')}
          />
          <ProfileDetailRow
            label="Previous Induced Abortions"
            value={formatObstetricValue(profile, 'previousInducedAbortions')}
          />
          <ProfileDetailRow
            label="Previous Stillbirths"
            value={formatObstetricValue(profile, 'previousStillbirths')}
          />
          <ProfileDetailRow
            label="Height"
            value={profile ? `${profile.heightCm} cm` : 'Not provided'}
          />
          <ProfileDetailRow
            label="Current Weight"
            value={profile ? `${profile.weightKg} kg` : 'Not provided'}
          />
          <ProfileDetailRow
            label="Existing Medical Conditions"
            value={formatMedicalConditions(profile)}
          />
          <ProfileDetailRow
            label="Allergies"
            value={formatProfileValue(profile?.allergies) || 'None recorded'}
          />
        </ProfileSectionCard>

        <ProfileSectionCard title="Clinic Information">
          <ProfileDetailRow
            label="Registered Clinic Name"
            value={formatProfileValue(registration?.clinic?.name)}
          />
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={handleClinicTransfer}>
            <Building2 size={18} color={BrandColors.primaryDark} />
            <Text style={styles.secondaryButtonText}>Request Clinic Transfer</Text>
          </Pressable>
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Emergency Contact"
          actionLabel="Edit"
          onActionPress={() => router.push('/edit-emergency-contact')}>
          <ProfileDetailRow
            label="Contact Name"
            value={formatProfileValue(profile?.emergencyContact?.name)}
          />
          <ProfileDetailRow
            label="Relationship"
            value={formatProfileValue(profile?.emergencyContact?.relationship)}
          />
          <ProfileDetailRow
            label="Phone Number"
            value={formatProfileValue(profile?.emergencyContact?.phoneNumber)}
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
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
  },
  profileHeaderCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BrandColors.border,
    alignItems: 'flex-start',
    gap: 4,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'left',
  },
  profileMeta: {
    fontSize: 15,
    color: BrandColors.primaryDark,
    fontWeight: '600',
    textAlign: 'left',
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
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primaryDark,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  buttonPressed: {
    opacity: 0.88,
  },
});
