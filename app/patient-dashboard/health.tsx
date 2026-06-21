import { HeartPulse } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';

export default function PatientHealthScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <HeartPulse size={32} color={BrandColors.primary} />
        </View>
        <Text style={styles.title}>Health</Text>
        <Text style={styles.subtitle}>
          Health monitoring and weight tracking features are coming soon.
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
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
});
