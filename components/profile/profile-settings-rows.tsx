import { ReactNode } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type ProfileToggleRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ProfileToggleRow({
  label,
  description,
  value,
  onValueChange,
}: ProfileToggleRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: BrandColors.border, true: BrandColors.primaryLight }}
        thumbColor={value ? BrandColors.primary : BrandColors.white}
      />
    </View>
  );
}

type ProfileNavGroupProps = {
  children: ReactNode;
};

export function ProfileNavGroup({ children }: ProfileNavGroupProps) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: BrandColors.text,
  },
  description: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  group: {
    gap: 0,
  },
});
