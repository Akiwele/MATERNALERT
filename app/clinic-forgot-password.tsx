import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthScreenHeader } from '@/components/auth-screen-header';
import { AuthTextField } from '@/components/auth-text-field';
import { AuthTextLink } from '@/components/auth-text-link';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';

export default function ClinicForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleReset = () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your clinic email address.');
      return;
    }

    Alert.alert(
      'Reset link sent',
      'Clinic password reset functionality will be connected soon.',
    );
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
            title="Forgot Password"
            subtitle="Enter your clinic email to receive reset instructions."
          />

          <View style={styles.form}>
            <AuthTextField
              label="Clinic Email"
              placeholder="clinic@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <PrimaryButton label="Send Reset Link" onPress={handleReset} />
          </View>

          <AuthTextLink text="Back to Login" onPress={() => router.back()} />
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  form: {
    gap: 18,
    marginBottom: 24,
  },
});
