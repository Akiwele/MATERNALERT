import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { HeartPulse, Hospital } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountTypeCard } from '@/components/account-type-card';
import { BrandColors } from '@/constants/brand';

function useResponsiveSpacing(screenHeight: number) {
  return useMemo(() => {
    const isCompact = screenHeight < 700;
    const isMedium = screenHeight < 850;

    if (isCompact) {
      return {
        scrollPaddingTop: 12,
        scrollPaddingBottom: 24,
        logoMarginBottom: 12,
        headerToCards: 32,
        cardsMarginTop: 16,
        cardGap: 16,
      };
    }

    if (isMedium) {
      return {
        scrollPaddingTop: 16,
        scrollPaddingBottom: 28,
        logoMarginBottom: 14,
        headerToCards: 36,
        cardsMarginTop: 24,
        cardGap: 16,
      };
    }

    return {
      scrollPaddingTop: 20,
      scrollPaddingBottom: 32,
      logoMarginBottom: 16,
      headerToCards: 40,
      cardsMarginTop: 28,
      cardGap: 16,
    };
  }, [screenHeight]);
}

export default function ChooseAccountTypeScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const spacing = useResponsiveSpacing(screenHeight);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: spacing.scrollPaddingTop,
            paddingBottom: spacing.scrollPaddingBottom,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { marginBottom: spacing.headerToCards }]}>
          <Image
            source={require('@/assets/images/maternalert-logo.png')}
            style={[styles.logo, { marginBottom: spacing.logoMarginBottom }]}
            contentFit="contain"
          />
          <Text style={styles.title}>Welcome to MaternAlert</Text>
          <Text style={styles.subtitle}>Select your account type</Text>
        </View>

        <View
          style={[
            styles.cards,
            { marginTop: spacing.cardsMarginTop, gap: spacing.cardGap },
          ]}>
          <AccountTypeCard
            icon={HeartPulse}
            title="Pregnant Woman"
            description="Track your pregnancy, appointments, and health alerts."
            buttonText="Continue"
            onPress={() => router.push('/patient-login')}
          />

          <AccountTypeCard
            icon={Hospital}
            title="Clinic / Doctor"
            description="Manage patients, antenatal visits, and health records."
            buttonText="Continue"
            onPress={() => router.push('/clinic-login')}
          />
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
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
  cards: {},
});
