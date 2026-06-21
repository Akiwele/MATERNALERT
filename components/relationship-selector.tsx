import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import {
  EMERGENCY_CONTACT_RELATIONSHIPS,
  EmergencyContactRelationship,
} from '@/constants/emergency-contact-relationships';

type RelationshipSelectorProps = {
  selectedRelationship: EmergencyContactRelationship | null;
  onSelect: (relationship: EmergencyContactRelationship) => void;
};

export function RelationshipSelector({
  selectedRelationship,
  onSelect,
}: RelationshipSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Relationship to Emergency Contact</Text>

      <Pressable style={styles.selector} onPress={() => setIsOpen((current) => !current)}>
        <Text style={[styles.selectorText, !selectedRelationship && styles.placeholder]}>
          {selectedRelationship ?? 'Select relationship'}
        </Text>
        <ChevronDown size={20} color={BrandColors.textSecondary} />
      </Pressable>

      {isOpen ? (
        <View style={styles.dropdown}>
          <ScrollView style={styles.optionsList} nestedScrollEnabled>
            {EMERGENCY_CONTACT_RELATIONSHIPS.map((relationship) => (
              <Pressable
                key={relationship}
                style={({ pressed }) => [
                  styles.option,
                  selectedRelationship === relationship && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => {
                  onSelect(relationship);
                  setIsOpen(false);
                }}>
                <Text style={styles.optionText}>{relationship}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    zIndex: 5,
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
  optionsList: {
    maxHeight: 220,
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
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
  },
});
