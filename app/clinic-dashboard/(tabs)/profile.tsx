import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CircleHelp, KeyRound, LogOut } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicDetailRow } from '@/components/clinic/clinic-detail-row';
import { ProfileSectionCard } from '@/components/profile/profile-section-card';
import { ProfileToggleRow } from '@/components/profile/profile-settings-rows';
import { BrandColors } from '@/constants/brand';
import { MOCK_CLINIC_SESSION } from '@/constants/clinic-session';
import {
  getClinicNotificationSettings,
  updateClinicNotificationSettings,
} from '@/stores/clinic-notification-settings';
import { ACCOUNT_TYPE_LOGIN_ROUTES } from '@/types/app-navigation';
import { clearAuthSession } from '@/utils/auth-session-storage';

function ProfileActionRow({
  label,
  icon: Icon,
  onPress,
  destructive = false,
}: {
  label: string;
  icon: typeof KeyRound;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.actionRow, pressed && styles.actionPressed]}
      onPress={onPress}>
      <Icon size={18} color={destructive ? '#DC2626' : BrandColors.primaryDark} />
      <Text style={[styles.actionText, destructive && styles.actionTextDestructive]}>{label}</Text>
    </Pressable>
  );
}

export default function ClinicProfileScreen() {
  const router = useRouter();
  const clinic = MOCK_CLINIC_SESSION;
  const [notificationSettings, setNotificationSettings] = useState(getClinicNotificationSettings());

  useFocusEffect(
    useCallback(() => {
      setNotificationSettings(getClinicNotificationSettings());
    }, []),
  );

  const updateToggle = (key: keyof typeof notificationSettings, value: boolean) => {
    const next = updateClinicNotificationSettings({ [key]: value });
    setNotificationSettings({ ...next });
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await clearAuthSession();
          router.replace(ACCOUNT_TYPE_LOGIN_ROUTES.clinic);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Clinic Profile</Text>
        </View>

        <View style={[styles.card, styles.infoCard]}>
          <ClinicDetailRow showDivider={false} label="Clinic Name" value={clinic.name} />
          <ClinicDetailRow showDivider={false} label="HEFRA Licence Number" value={clinic.hefraLicenceNumber} />
          <ClinicDetailRow showDivider={false} label="Official Email" value={clinic.officialEmail} />
          <ClinicDetailRow showDivider={false} label="Phone Number" value={clinic.phoneNumber} />
          <ClinicDetailRow showDivider={false} label="Region" value={clinic.region} />
          <ClinicDetailRow showDivider={false} label="District" value={clinic.district} />
          <ClinicDetailRow showDivider={false} label="Account Status" value={clinic.accountStatus} />
        </View>

        <ProfileSectionCard title="Notification Settings">
          <ProfileToggleRow
            label="New Patient Transfer Requests"
            description="Get notified when patients request to transfer to your clinic."
            value={notificationSettings.newPatientTransferRequests}
            onValueChange={(value) => updateToggle('newPatientTransferRequests', value)}
          />
          <ProfileToggleRow
            label="Appointment Reminders"
            description="Receive reminders for upcoming patient appointments."
            value={notificationSettings.appointmentReminders}
            onValueChange={(value) => updateToggle('appointmentReminders', value)}
          />
          <ProfileToggleRow
            label="Missed Appointment Alerts"
            description="Be alerted when patients miss scheduled visits."
            value={notificationSettings.missedAppointmentAlerts}
            onValueChange={(value) => updateToggle('missedAppointmentAlerts', value)}
          />
          <ProfileToggleRow
            label="Risk Alerts"
            description="Be notified about high-risk pregnancy updates for your patients."
            value={notificationSettings.riskAlerts}
            onValueChange={(value) => updateToggle('riskAlerts', value)}
          />
        </ProfileSectionCard>

        <View style={styles.card}>
          <ProfileActionRow
            label="Change Password"
            icon={KeyRound}
            onPress={() => router.push('/clinic-forgot-password')}
          />
          <ProfileActionRow
            label="Help & Support"
            icon={CircleHelp}
            onPress={() => router.push('/profile-content?section=support')}
          />
          <ProfileActionRow label="Sign Out" icon={LogOut} onPress={handleSignOut} destructive />
        </View>
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
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    gap: 4,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCard: {
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  actionPressed: {
    opacity: 0.88,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
  },
  actionTextDestructive: {
    color: '#DC2626',
  },
});
