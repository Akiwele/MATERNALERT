import { ChevronDown, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { Clinic, MOCK_CLINICS } from '@/constants/clinics';

type ClinicSelectorProps = {
  selectedClinic: Clinic | null;
  onSelect: (clinic: Clinic) => void;
  error?: string;
};

export function ClinicSelector({ selectedClinic, onSelect, error }: ClinicSelectorProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredClinics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return MOCK_CLINICS;
    }

    return MOCK_CLINICS.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(normalizedQuery) ||
        clinic.code.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const handleSelect = (clinic: Clinic) => {
    onSelect(clinic);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Clinic</Text>

      <Pressable
        style={styles.selector}
        onPress={() => setIsOpen((current) => !current)}>
        <Text style={[styles.selectorText, !selectedClinic && styles.placeholder]}>
          {selectedClinic ? `${selectedClinic.name} (${selectedClinic.code})` : 'Choose your clinic'}
        </Text>
        <ChevronDown size={20} color={BrandColors.textSecondary} />
      </Pressable>

      {isOpen ? (
        <View style={styles.dropdown}>
          <View style={styles.searchRow}>
            <Search size={18} color={BrandColors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by clinic name or code"
              placeholderTextColor={BrandColors.textSecondary}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <ScrollView
            style={styles.optionsList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled>
            {filteredClinics.length > 0 ? (
              filteredClinics.map((clinic) => (
                <Pressable
                  key={clinic.id}
                  style={({ pressed }) => [
                    styles.option,
                    selectedClinic?.id === clinic.id && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => handleSelect(clinic)}>
                  <Text style={styles.optionName}>{clinic.name}</Text>
                  <Text style={styles.optionCode}>{clinic.code}</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyText}>No clinics found. Try a different search.</Text>
            )}
          </ScrollView>
        </View>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  selector: {
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: BrandColors.text,
    marginRight: 8,
  },
  placeholder: {
    color: BrandColors.textSecondary,
  },
  dropdown: {
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: BrandColors.text,
    paddingVertical: 0,
  },
  optionsList: {
    maxHeight: 200,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  optionSelected: {
    backgroundColor: BrandColors.primaryMuted,
  },
  optionPressed: {
    backgroundColor: BrandColors.primaryLight,
  },
  optionName: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 2,
  },
  optionCode: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  emptyText: {
    padding: 16,
    fontSize: 14,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
  error: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
});
