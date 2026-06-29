import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { resolveInitialRoute } from '@/utils/initial-route';

const SPLASH_DURATION_MS = 2000;

export default function MaternAlertSplashScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const logoWidth = Math.min(screenWidth * 0.96, 392);
  const logoHeight = logoWidth * 1.15;

  useEffect(() => {
    let isActive = true;

    const initializeApp = async () => {
      await SplashScreen.hideAsync();
      await new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION_MS));

      if (!isActive) {
        return;
      }

      const initialRoute = await resolveInitialRoute();
      router.replace(initialRoute);
    };

    initializeApp();

    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(900)}>
        <Image
          source={require('@/assets/images/logo-name.png')}
          style={{ width: logoWidth, height: logoHeight }}
          contentFit="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
