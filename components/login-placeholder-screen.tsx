import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';

type LoginPlaceholderScreenProps = {
  title: string;
  subtitle: string;
  note?: string;
};

export function LoginPlaceholderScreen({ title, subtitle, note }: LoginPlaceholderScreenProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {note ? <Text style={styles.note}>{note}</Text> : null}
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  note: {
    marginTop: 8,
    fontSize: 14,
    color: BrandColors.primaryDark,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    backgroundColor: BrandColors.primaryMuted,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
