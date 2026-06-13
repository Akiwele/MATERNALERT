import { Pressable, StyleSheet, Text } from 'react-native';

import { BrandColors } from '@/constants/brand';

type AuthTextLinkProps = {
  text: string;
  onPress: () => void;
  align?: 'center' | 'left';
};

export function AuthTextLink({ text, onPress, align = 'center' }: AuthTextLinkProps) {
  return (
    <Pressable onPress={onPress} style={[styles.container, align === 'left' && styles.left]}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  left: {
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
});
