import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type FormSectionProps = {
  title: string;
  children: ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  content: {
    gap: 18,
  },
});
