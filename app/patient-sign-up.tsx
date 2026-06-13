import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

export default function PatientSignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const handleCreateAccount = () => {
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Password and confirm password must match.');
      return;
    }

    if (!selectedClinic) {
      Alert.alert('Clinic required', 'Please select your clinic before creating an account.');
      return;
    }

    router.replace('/pregnancy-profile-setup');
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
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <AuthTextField
              label="Phone Number"
              placeholder="e.g. 024 123 4567"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <AuthTextField
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthTextField
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <AuthTextField
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
            />

            <ClinicSelector selectedClinic={selectedClinic} onSelect={setSelectedClinic} />

            <PrimaryButton label="Create Account" onPress={handleCreateAccount} />
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
