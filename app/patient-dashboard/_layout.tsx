import { Tabs } from 'expo-router';
import { BookOpen, Calendar, HeartPulse, Home } from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppointmentsProvider } from '@/contexts/appointments-context';
import { HealthProvider } from '@/contexts/health-context';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';

const TAB_BAR_CONTENT_HEIGHT = 70;
const TAB_BAR_CORNER_RADIUS = 14;
const TAB_ICON_SIZE = 22;

export default function PatientDashboardLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? 8 : 0,
  );
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + bottomInset;

  return (
    <AppointmentsProvider>
      <HealthProvider>
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: BrandColors.primary,
          tabBarInactiveTintColor: BrandColors.textSecondary,
          tabBarStyle: {
            backgroundColor: BrandColors.white,
            borderTopWidth: 1,
            borderTopColor: BrandColors.border,
            borderTopLeftRadius: TAB_BAR_CORNER_RADIUS,
            borderTopRightRadius: TAB_BAR_CORNER_RADIUS,
            height: tabBarHeight,
            paddingTop: 8,
            paddingBottom: bottomInset,
            ...Platform.select({
              ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
              },
              android: {
                elevation: 2,
              },
              default: {},
            }),
          },
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarLabelStyle: styles.tabBarLabel,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={TAB_ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: 'Appointments',
            tabBarIcon: ({ color }) => <Calendar size={TAB_ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            title: 'Health',
            tabBarIcon: ({ color }) => <HeartPulse size={TAB_ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="education"
          options={{
            title: 'Education',
            tabBarIcon: ({ color }) => <BookOpen size={TAB_ICON_SIZE} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
      </HealthProvider>
    </AppointmentsProvider>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabBarIcon: {
    marginBottom: 2,
  },
  tabBarLabel: {
    fontSize: PatientDashboardTypography.tabLabel,
    fontWeight: '600',
    marginTop: 2,
    includeFontPadding: false,
  },
});
