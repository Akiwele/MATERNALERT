import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PregnancyProfileForm } from '@/components/pregnancy-profile-form';
import { BrandColors } from '@/constants/brand';
import { setPatientProfileAsync } from '@/stores/patient-profile';
import { syncPatientToCareNetwork } from '@/utils/sync-patient-care-network';

function useResponsiveSpacing(screenHeight: number) {
  return useMemo(() => {
    const isCompact = screenHeight < 700;
    const isMedium = screenHeight < 850;

    if (isCompact) {
      return { scrollPaddingTop: 4, scrollPaddingBottom: 24, headerToForm: 20 };
    }

    if (isMedium) {
      return { scrollPaddingTop: 8, scrollPaddingBottom: 28, headerToForm: 24 };
    }

    return { scrollPaddingTop: 12, scrollPaddingBottom: 32, headerToForm: 28 };
  }, [screenHeight]);
}

export default function PregnancyProfileSetupScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const spacing = useResponsiveSpacing(screenHeight);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={() => router.replace('/patient-sign-up')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: spacing.scrollPaddingTop,
              paddingBottom: spacing.scrollPaddingBottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Pregnancy Profile Setup</Text>
            <Text style={styles.subtitle}>Help us personalize your pregnancy journey.</Text>
          </View>

          <View style={{ marginTop: spacing.headerToForm }}>
            <PregnancyProfileForm
              mode="setup"
              submitLabel="Continue"
              onSubmit={async (result) => {
                if (!result.dateOfBirth) {
                  return;
                }

                await setPatientProfileAsync({
                  dateOfBirth: result.dateOfBirth,
                  emergencyContact: result.emergencyContact ?? null,
                  lmpDate: result.lmpDate,
                  isFirstPregnancy: result.isFirstPregnancy,
                  obstetricHistory: result.obstetricHistory,
                  heightCm: result.heightCm,
                  weightKg: result.weightKg,
                  bloodGroup: result.bloodGroup ?? null,
                  allergies: result.allergies,
                  medicalConditions: result.medicalConditions,
                  otherConditionDetails: result.otherConditionDetails,
                  riskStatus: result.riskStatus,
                });

                syncPatientToCareNetwork();

                router.replace('/patient-dashboard');
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  flex: {
    flex: 1,
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
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});
