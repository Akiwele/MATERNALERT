import { BookOpen } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';

export default function PatientEducationScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <BookOpen size={32} color={BrandColors.primary} />
        </View>
        <Text style={styles.title}>Education</Text>
        <Text style={styles.subtitle}>
          Pregnancy education articles and tips will be available here soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: PatientDashboardTypography.greeting,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: PatientDashboardTypography.body,
    lineHeight: 24,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
});
