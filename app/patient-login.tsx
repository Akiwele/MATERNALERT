import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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

import { AuthScreenHeader } from '@/components/auth-screen-header';
import { AuthTextField } from '@/components/auth-text-field';
import { AuthTextLink } from '@/components/auth-text-link';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import { validateEmail, validatePassword } from '@/utils/form-validation';

function useResponsiveSpacing(screenHeight: number) {
  return useMemo(() => {
    const isCompact = screenHeight < 700;
    const isMedium = screenHeight < 850;

    if (isCompact) {
      return {
        scrollPaddingTop: 4,
        scrollPaddingBottom: 16,
        headerToForm: 20,
        fieldGap: 16,
        formBlockGap: 16,
        actionGap: 8,
        formToLinks: 12,
      };
    }

    if (isMedium) {
      return {
        scrollPaddingTop: 8,
        scrollPaddingBottom: 20,
        headerToForm: 28,
        fieldGap: 18,
        formBlockGap: 18,
        actionGap: 10,
        formToLinks: 14,
      };
    }

    return {
      scrollPaddingTop: 16,
      scrollPaddingBottom: 24,
      headerToForm: 32,
      fieldGap: 18,
      formBlockGap: 20,
      actionGap: 10,
      formToLinks: 16,
    };
  }, [screenHeight]);
}

export default function PatientLoginScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const spacing = useResponsiveSpacing(screenHeight);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError ?? '',
      password: passwordError ?? '',
    });

    if (emailError || passwordError) {
      return;
    }

    router.replace('/patient-dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.replace('/choose-account-type')}>
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
          <AuthScreenHeader
            title="Welcome Back"
            subtitle="Sign in to continue your pregnancy journey."
          />

          <View
            style={[
              styles.form,
              {
                marginTop: spacing.headerToForm,
                gap: spacing.formBlockGap,
                marginBottom: spacing.formToLinks,
              },
            ]}>
            <View style={[styles.fields, { gap: spacing.fieldGap }]}>
              <AuthTextField
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) {
                    setErrors((current) => ({ ...current, email: '' }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email || undefined}
              />

              <AuthTextField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) {
                    setErrors((current) => ({ ...current, password: '' }));
                  }
                }}
                isPassword
                error={errors.password || undefined}
              />
            </View>

            <View style={[styles.actions, { gap: spacing.actionGap }]}>
              <AuthTextLink
                text="Forgot Password?"
                align="left"
                onPress={() => router.push('/patient-forgot-password')}
              />

              <PrimaryButton label="Login" onPress={handleLogin} />
            </View>
          </View>

          <View style={styles.links}>
            <PressableRow
              prompt="Don't have an account?"
              action="Sign Up"
              onPress={() => router.push('/patient-sign-up')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type PressableRowProps = {
  prompt: string;
  action: string;
  onPress: () => void;
};

function PressableRow({ prompt, action, onPress }: PressableRowProps) {
  return (
    <View style={styles.promptRow}>
      <Text style={styles.promptText}>{prompt} </Text>
      <Text style={styles.promptAction} onPress={onPress}>
        {action}
      </Text>
    </View>
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
  form: {},
  fields: {},
  actions: {},
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
