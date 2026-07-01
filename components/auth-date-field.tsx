import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
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
  const insets = useSafeAreaInsets();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [draftValue, setDraftValue] = useState(value ?? new Date());

  const openPicker = () => {
    setDraftValue(value ?? new Date());
    setIsPickerVisible(true);
  };

  const closePicker = () => {
    setIsPickerVisible(false);
  };

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDraftValue(selectedDate);
    }
  };

  const handleConfirm = () => {
    onChange(draftValue);
    closePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.selector} onPress={openPicker}>
        <Text style={[styles.selectorText, !value && styles.placeholder]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <CalendarDays size={20} color={BrandColors.primary} />
      </Pressable>

      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={closePicker}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={closePicker} />

          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.toolbar}>
              <Pressable onPress={closePicker} hitSlop={8}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Text style={styles.toolbarTitle}>Select Date</Text>
              <Pressable onPress={handleConfirm} hitSlop={8}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={draftValue}
                mode="date"
                display="spinner"
                themeVariant="light"
                textColor={BrandColors.text}
                accentColor={BrandColors.primary}
                onChange={handleChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },
  sheet: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
  toolbarTitle: {
    fontSize: PatientDashboardTypography.bodySmall,
    fontWeight: '600',
    color: BrandColors.text,
  },
  cancelText: {
    fontSize: PatientDashboardTypography.bodySmall,
    color: BrandColors.textSecondary,
  },
  doneText: {
    fontSize: PatientDashboardTypography.bodySmall,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  pickerContainer: {
    backgroundColor: BrandColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
