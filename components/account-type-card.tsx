import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

const ICON_SIZE = 38;

type AccountTypeCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  variant?: 'default' | 'admin';
};

export function AccountTypeCard({
  icon: Icon,
  title,
  description,
  buttonText,
  onPress,
  variant = 'default',
}: AccountTypeCardProps) {
  const isAdmin = variant === 'admin';

  return (
    <View style={[styles.card, isAdmin && styles.adminCard]}>
      <View style={styles.header}>
        <View style={[styles.iconBadge, isAdmin && styles.adminIconBadge]}>
          <Icon size={ICON_SIZE} color={BrandColors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.description}>{description}</Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          isAdmin && styles.adminButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 14,
  },
  adminCard: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminIconBadge: {
    backgroundColor: '#F3F4F6',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.textSecondary,
  },
  button: {
    backgroundColor: BrandColors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  adminButton: {
    backgroundColor: BrandColors.primaryDark,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: BrandColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
