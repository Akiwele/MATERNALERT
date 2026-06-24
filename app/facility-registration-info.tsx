import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthScreenHeader } from '@/components/auth-screen-header';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';

const CLINIC_APPLICATION_URL = 'http://10.5.50.232:5173/apply';

const APPLICATION_STEPS = [
  'Prepare your valid HeFRA licence.',
  'Complete the online facility application form.',
  'Your application will be reviewed by the MaternAlert Administration Team.',
  'Approved facilities will receive an activation email to create their account password.',
] as const;

function useResponsiveSpacing(screenHeight: number) {
  return useMemo(() => {
    const isCompact = screenHeight < 700;

    if (isCompact) {
      return {
        scrollPaddingTop: 4,
        scrollPaddingBottom: 20,
        contentGap: 16,
        sectionGap: 10,
      };
    }

    return {
      scrollPaddingTop: 8,
      scrollPaddingBottom: 24,
      contentGap: 20,
      sectionGap: 12,
    };
  }, [screenHeight]);
}

export default function FacilityRegistrationInfoScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const spacing = useResponsiveSpacing(screenHeight);

  const handleApplyForAccess = () => {
    Linking.openURL(CLINIC_APPLICATION_URL);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: spacing.scrollPaddingTop,
            paddingBottom: spacing.scrollPaddingBottom,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <AuthScreenHeader
          title="Register Your Facility"
          subtitle="MaternAlert is available to licensed and verified health facilities only."
        />

        <View style={[styles.content, { gap: spacing.contentGap }]}>
          <View style={[styles.section, { gap: spacing.sectionGap }]}>
            <Text style={styles.sectionTitle}>Before you apply</Text>

            <View style={styles.bulletList}>
              {APPLICATION_STEPS.map((step) => (
                <View key={step} style={styles.bulletItem}>
                  <Text style={styles.bulletMarker}>•</Text>
                  <Text style={styles.bulletText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.note}>
            Facility access is granted only after successful verification.
          </Text>

          <PrimaryButton label="Apply for Clinic Access" onPress={handleApplyForAccess} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
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
  content: {
    marginTop: 4,
  },
  section: {},
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: BrandColors.text,
    lineHeight: 24,
  },
  bulletList: {
    gap: 10,
    paddingLeft: 2,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletMarker: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.primary,
    fontWeight: '600',
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 21,
    fontStyle: 'italic',
  },
});
