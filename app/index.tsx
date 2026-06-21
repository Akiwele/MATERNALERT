import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const SPLASH_DURATION_MS = 2000;

export default function MaternAlertSplashScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const logoWidth = Math.min(screenWidth * 0.96, 392);
  const logoHeight = logoWidth * 1.15;

  useEffect(() => {
    SplashScreen.hideAsync();

    const timer = setTimeout(() => {
      router.replace('/choose-account-type');
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
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
