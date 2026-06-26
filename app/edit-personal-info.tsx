import { useRouter } from 'expo-router';
import { useState } from 'react';
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
import { BrandColors } from '@/constants/brand';
import { BloodGroup } from '@/constants/blood-groups';
import {
  getPatientRegistration,
  updatePatientRegistration,
} from '@/stores/patient-registration';
import { getPatientProfile, updatePatientProfile } from '@/stores/patient-profile';
import {
  validateFullName,
  validateGhanaPhoneNumber,
  validateSignUpEmail,
} from '@/utils/form-validation';

export default function EditPersonalInfoScreen() {
  const router = useRouter();
  const registration = getPatientRegistration();
  const profile = getPatientProfile();

  const [fullName, setFullName] = useState(registration?.fullName ?? '');
  const [phoneNumber, setPhoneNumber] = useState(registration?.phoneNumber ?? '');
  const [email, setEmail] = useState(registration?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(profile?.dateOfBirth ?? null);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | null>(profile?.bloodGroup ?? null);

  const handleSave = () => {
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

    updatePatientRegistration({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
    });

    updatePatientProfile({
      dateOfBirth,
      bloodGroup,
    });

    router.back();
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
            <PrimaryButton label="Save Changes" onPress={handleSave} />
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
