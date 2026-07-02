import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthDateField } from '@/components/auth-date-field';
import { AuthTextField } from '@/components/auth-text-field';
import { BloodGroupSelector } from '@/components/blood-group-selector';
import { PrimaryButton } from '@/components/primary-button';
import { usePatientData } from '@/contexts/patient-data-context';
import { BrandColors } from '@/constants/brand';
import { BloodGroup } from '@/constants/blood-groups';
import {
  updatePatientRegistrationAsync,
} from '@/stores/patient-registration';
import { updatePatientProfileAsync } from '@/stores/patient-profile';
import { syncPatientToCareNetwork } from '@/utils/sync-patient-care-network';
import {
  validateFullName,
  validateGhanaPhoneNumber,
  validateSignUpEmail,
} from '@/utils/form-validation';

export default function EditPersonalInfoScreen() {
  const router = useRouter();
  const { profile, registration } = usePatientData();

  const [fullName, setFullName] = useState(registration?.fullName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(registration?.phoneNumber ?? '');
  const [email, setEmail] = useState(registration?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(profile?.dateOfBirth ?? null);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | null>(profile?.bloodGroup ?? null);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (registration) {
        setFullName(registration.fullName);
        setPhoneNumber(registration.phoneNumber);
        setEmail(registration.email);
      }

      if (profile) {
        setDateOfBirth(profile.dateOfBirth);
        setBloodGroup(profile.bloodGroup);
      }
    }, [profile, registration]),
  );

  const handleSave = async () => {
    const fullNameError = validateFullName(fullName);
    const phoneNumberError = validateGhanaPhoneNumber(phoneNumber);
    const emailError = validateSignUpEmail(email);

    if (fullNameError || phoneNumberError || emailError) {
      Alert.alert('Invalid information', fullNameError ?? phoneNumberError ?? emailError ?? '');
      return;
    }

    if (!dateOfBirth) {
      Alert.alert('Missing information', 'Please select your date of birth.');
      return;
    }

    if (!registration) {
      Alert.alert('Profile unavailable', 'Please sign in again before editing your information.');
      return;
    }

    setIsSaving(true);

    try {
      await updatePatientRegistrationAsync({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
      });

      if (profile) {
        await updatePatientProfileAsync({
          dateOfBirth,
          bloodGroup,
        });
      }

      syncPatientToCareNetwork();
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

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
          <Text style={styles.title}>Edit Personal Information</Text>
          <Text style={styles.subtitle}>Update your account details.</Text>

          <View style={styles.form}>
            <AuthTextField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <AuthTextField
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <AuthTextField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthDateField
              label="Date of Birth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              maximumDate={new Date()}
            />
            <BloodGroupSelector
              selectedBloodGroup={bloodGroup}
              onSelect={setBloodGroup}
              label="Blood Group"
            />
            <PrimaryButton
              label={isSaving ? 'Saving...' : 'Save Changes'}
              onPress={() => {
                void handleSave();
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
    paddingBottom: 32,
    gap: 16,
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
  form: {
    gap: 18,
    marginTop: 8,
  },
});
