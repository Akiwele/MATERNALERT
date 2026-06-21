import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthScreenHeader } from '@/components/auth-screen-header';
import { AuthTextField } from '@/components/auth-text-field';
import { ClinicSelector } from '@/components/clinic-selector';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import { Clinic } from '@/constants/clinics';
import { setPendingPatientRegistration } from '@/stores/patient-registration';
import {
  validateClinicSelection,
  validateConfirmPassword,
  validateFullName,
  validateGhanaPhoneNumber,
  validateSignUpEmail,
  validateSignUpPassword,
} from '@/utils/form-validation';

type SignUpErrors = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  clinic: string;
};

const INITIAL_ERRORS: SignUpErrors = {
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  clinic: '',
};

export default function PatientSignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [errors, setErrors] = useState<SignUpErrors>(INITIAL_ERRORS);

  const clearError = (field: keyof SignUpErrors) => {
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const handleNext = () => {
    const fullNameError = validateFullName(fullName);
    const phoneNumberError = validateGhanaPhoneNumber(phoneNumber);
    const emailError = validateSignUpEmail(email);
    const passwordError = validateSignUpPassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    const clinicError = validateClinicSelection(selectedClinic);

    const nextErrors: SignUpErrors = {
      fullName: fullNameError ?? '',
      phoneNumber: phoneNumberError ?? '',
      email: emailError ?? '',
      password: passwordError ?? '',
      confirmPassword: confirmPasswordError ?? '',
      clinic: clinicError ?? '',
    };

    setErrors(nextErrors);

    if (
      fullNameError ||
      phoneNumberError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      clinicError
    ) {
      return;
    }

    setPendingPatientRegistration({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      email: email.trim(),
      password,
      clinic: selectedClinic!,
    });

    router.push('/patient-privacy-agreement');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <AuthScreenHeader
            title="Create Your Account"
            subtitle="Join MaternAlert to manage your pregnancy safely."
          />

          <View style={styles.form}>
            <AuthTextField
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);
                clearError('fullName');
              }}
              autoCapitalize="words"
              error={errors.fullName || undefined}
            />

            <AuthTextField
              label="Phone Number"
              placeholder="e.g. 024 123 4567"
              value={phoneNumber}
              onChangeText={(value) => {
                setPhoneNumber(value);
                clearError('phoneNumber');
              }}
              keyboardType="phone-pad"
              error={errors.phoneNumber || undefined}
            />

            <AuthTextField
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                clearError('email');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email || undefined}
            />

            <AuthTextField
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearError('password');
                if (errors.confirmPassword) {
                  clearError('confirmPassword');
                }
              }}
              isPassword
              error={errors.password || undefined}
            />

            <AuthTextField
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearError('confirmPassword');
              }}
              isPassword
              error={errors.confirmPassword || undefined}
            />

            <ClinicSelector
              selectedClinic={selectedClinic}
              onSelect={(clinic) => {
                setSelectedClinic(clinic);
                clearError('clinic');
              }}
              error={errors.clinic || undefined}
            />

            <PrimaryButton label="Next" onPress={handleNext} />
          </View>

          <View style={styles.links}>
            <View style={styles.promptRow}>
              <Text style={styles.promptText}>Already have an account? </Text>
              <Text style={styles.promptAction} onPress={() => router.replace('/patient-login')}>
                Login
              </Text>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  form: {
    gap: 18,
    marginBottom: 24,
  },
  links: {
    alignItems: 'center',
  },
  promptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  promptText: {
    fontSize: 15,
    color: BrandColors.textSecondary,
  },
  promptAction: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
});
