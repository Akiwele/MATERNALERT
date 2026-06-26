import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { BrandColors } from '@/constants/brand';

type HealthActionCardProps = {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
};

export function HealthActionCard({ label, icon: Icon, onPress }: HealthActionCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}>
      <View style={styles.iconWrap}>
        <Icon size={22} color={BrandColors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    minHeight: 92,
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
    justifyContent: 'center',
  },
  cardPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    lineHeight: 18,
  },
});
