import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type YesNoSelectorProps = {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
};

export function YesNoSelector({ label, value, onChange }: YesNoSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        <Pressable
          style={[styles.option, value === true && styles.optionSelected]}
          onPress={() => onChange(true)}>
          <Text style={[styles.optionText, value === true && styles.optionTextSelected]}>Yes</Text>
        </Pressable>
        <Pressable
          style={[styles.option, value === false && styles.optionSelected]}
          onPress={() => onChange(false)}>
          <Text style={[styles.optionText, value === false && styles.optionTextSelected]}>No</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: BrandColors.white,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionSelected: {
    backgroundColor: BrandColors.primaryMuted,
    borderColor: BrandColors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  optionTextSelected: {
    color: BrandColors.primaryDark,
  },
});
