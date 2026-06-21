import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { formatDisplayDate } from '@/utils/pregnancy-calculations';

type AuthDateFieldProps = {
  label: string;
  placeholder?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
};

export function AuthDateField({
  label,
  placeholder = 'Select date',
  value,
  onChange,
  maximumDate,
  minimumDate,
}: AuthDateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.selector} onPress={() => setShowPicker(true)}>
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <CalendarDays size={20} color={BrandColors.primary} />
      </Pressable>

      {showPicker ? (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
          {Platform.OS === 'ios' ? (
            <Pressable style={styles.doneButton} onPress={() => setShowPicker(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
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
  pickerContainer: {
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: 'hidden',
  },
  doneButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.border,
    backgroundColor: BrandColors.primaryMuted,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.primary,
  },
});
