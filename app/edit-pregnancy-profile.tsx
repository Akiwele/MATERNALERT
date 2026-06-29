import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
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
import { getPatientProfile, updatePatientProfile } from '@/stores/patient-profile';
import { syncPatientToCareNetwork } from '@/utils/sync-patient-care-network';

export default function EditPregnancyProfileScreen() {
  const router = useRouter();
  const profile = getPatientProfile();
  const { height: screenHeight } = useWindowDimensions();
  const headerSpacing = useMemo(() => (screenHeight < 700 ? 16 : 24), [screenHeight]);

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </Pressable>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No pregnancy profile found</Text>
          <Text style={styles.emptyText}>Complete pregnancy profile setup first.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.header, { marginBottom: headerSpacing }]}>
            <Text style={styles.title}>Edit Pregnancy Information</Text>
            <Text style={styles.subtitle}>Update your pregnancy health details.</Text>
          </View>

          <PregnancyProfileForm
            mode="edit-pregnancy"
            initialProfile={profile}
            submitLabel="Save Changes"
            onSubmit={(result) => {
              updatePatientProfile({
                lmpDate: result.lmpDate,
                isFirstPregnancy: result.isFirstPregnancy,
                obstetricHistory: result.obstetricHistory,
                heightCm: result.heightCm,
                weightKg: result.weightKg,
                allergies: result.allergies,
                medicalConditions: result.medicalConditions,
                otherConditionDetails: result.otherConditionDetails,
                riskStatus: result.riskStatus,
                ancBookNumber: result.ancBookNumber,
              });

              syncPatientToCareNetwork();

              router.back();
            }}
          />
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
    paddingBottom: 32,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 15,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  emptyText: {
    fontSize: 15,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
});
