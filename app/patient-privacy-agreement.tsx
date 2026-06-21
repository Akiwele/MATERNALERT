import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthScreenHeader } from '@/components/auth-screen-header';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import { PRIVACY_AGREEMENT_TERMS } from '@/constants/privacy-terms';
import {
  createPatientAccount,
  getPendingPatientRegistration,
} from '@/stores/patient-registration';

export default function PatientPrivacyAgreementScreen() {
  const router = useRouter();
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleCreateAccount = () => {
    const pending = getPendingPatientRegistration();

    if (!pending) {
      Alert.alert(
        'Registration incomplete',
        'Please complete the sign up form before creating your account.',
      );
      router.replace('/patient-sign-up');
      return;
    }

    if (!hasAgreed) {
      return;
    }

    createPatientAccount();
    router.replace('/pregnancy-profile-setup');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <AuthScreenHeader
          title="Privacy Agreement & Terms of Use"
          subtitle="Please read and agree before creating your account."
        />

        <View style={styles.agreementCard}>
          <ScrollView
            style={styles.agreementScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator>
            {PRIVACY_AGREEMENT_TERMS.map((term, index) => (
              <View key={term} style={styles.termRow}>
                <Text style={styles.termBullet}>{index + 1}.</Text>
                <Text style={styles.termText}>{term}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Pressable style={styles.checkboxRow} onPress={() => setHasAgreed((current) => !current)}>
          <View style={[styles.checkbox, hasAgreed && styles.checkboxChecked]}>
            {hasAgreed ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read and agree to the Privacy Policy and Terms of Use.
          </Text>
        </Pressable>

        <PrimaryButton
          label="Create Account"
          onPress={handleCreateAccount}
          disabled={!hasAgreed}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 20,
  },
  agreementCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    maxHeight: 320,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  agreementScroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  termRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  termBullet: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primary,
    lineHeight: 22,
  },
  termText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: BrandColors.text,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BrandColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: BrandColors.white,
  },
  checkboxChecked: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  checkmark: {
    color: BrandColors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.text,
  },
});
