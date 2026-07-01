import { Search } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

import { BrandColors } from '@/constants/brand';

type ClinicPatientSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function ClinicPatientSearchBar({
  value,
  onChangeText,
  placeholder = 'Search by name, phone number, or email...',
}: ClinicPatientSearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={18} color={BrandColors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={BrandColors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: BrandColors.text,
    padding: 0,
  },
});
