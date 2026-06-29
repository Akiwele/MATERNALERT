import { useRouter } from 'expo-router';
import { CircleHelp, KeyRound, LogOut } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClinicDetailRow } from '@/components/clinic/clinic-detail-row';
import { BrandColors } from '@/constants/brand';
import { MOCK_CLINIC_SESSION } from '@/constants/clinic-session';
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
          <Text style={styles.subtitle}>Verified facility account</Text>
        </View>

        <View style={styles.card}>
          <ClinicDetailRow label="Clinic Name" value={clinic.name} />
          <ClinicDetailRow label="HeFRA Licence Number" value={clinic.hefraLicenceNumber} />
          <ClinicDetailRow label="Official Email" value={clinic.officialEmail} />
          <ClinicDetailRow label="Phone Number" value={clinic.phoneNumber} />
          <ClinicDetailRow label="Region" value={clinic.region} />
          <ClinicDetailRow label="District" value={clinic.district} />
          <ClinicDetailRow label="Account Status" value={clinic.accountStatus} />
        </View>

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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: BrandColors.textSecondary,
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
