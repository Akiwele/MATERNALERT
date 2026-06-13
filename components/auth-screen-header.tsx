import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type AuthScreenHeaderProps = {
  title: string;
  subtitle: string;
};

export function AuthScreenHeader({ title, subtitle }: AuthScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/maternalert-logo.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: 16,
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
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});
