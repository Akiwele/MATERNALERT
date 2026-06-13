import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthScreenHeader } from '@/components/auth-screen-header';
import { BrandColors } from '@/constants/brand';

export default function ClinicDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AuthScreenHeader
          title="Clinic Dashboard"
          subtitle="Welcome. Clinic management features are coming soon."
        />

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>Verified clinic access</Text>
          <Text style={styles.placeholderText}>
            This dashboard will manage patients, antenatal visits, and health records.
          </Text>
        </View>

        <Text style={styles.backLink} onPress={() => router.replace('/choose-account-type')}>
          Back to Account Type Selection
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  placeholderCard: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  placeholderText: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.textSecondary,
  },
  backLink: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
});
