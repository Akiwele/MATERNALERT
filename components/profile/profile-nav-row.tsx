import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type ProfileNavRowProps = {
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
};

export function ProfileNavRow({ label, icon: Icon, onPress }: ProfileNavRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}>
      <View style={styles.left}>
        {Icon ? (
          <View style={styles.iconWrap}>
            <Icon size={18} color={BrandColors.primary} />
          </View>
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <ChevronRight size={18} color={BrandColors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    gap: 12,
  },
  rowPressed: {
    opacity: 0.85,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: BrandColors.text,
  },
});
