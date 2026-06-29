import { Stack } from 'expo-router';

import { ClinicDataProvider } from '@/contexts/clinic-data-context';
import { BrandColors } from '@/constants/brand';

export default function ClinicDashboardLayout() {
  return (
    <ClinicDataProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BrandColors.background },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="patient/[id]"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="record-visit"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="add-appointment"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </ClinicDataProvider>
  );
}
