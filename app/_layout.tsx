import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PatientDataProvider } from '@/contexts/patient-data-context';
import { BrandColors } from '@/constants/brand';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <PatientDataProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BrandColors.background },
          animation: 'fade',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="choose-account-type" />
        <Stack.Screen name="patient-login" />
        <Stack.Screen name="patient-sign-up" />
        <Stack.Screen name="patient-privacy-agreement" />
        <Stack.Screen name="patient-forgot-password" />
        <Stack.Screen name="pregnancy-profile-setup" />
        <Stack.Screen name="edit-personal-info" />
        <Stack.Screen name="edit-pregnancy-profile" />
        <Stack.Screen name="edit-emergency-contact" />
        <Stack.Screen name="profile-content" />
        <Stack.Screen name="patient-dashboard" />
        <Stack.Screen name="clinic-login" />
        <Stack.Screen name="facility-registration-info" />
        <Stack.Screen name="clinic-forgot-password" />
        <Stack.Screen name="clinic-dashboard" />
        <Stack.Screen name="admin-login" />
      </Stack>
      <StatusBar style="dark" />
    </PatientDataProvider>
  );
}
