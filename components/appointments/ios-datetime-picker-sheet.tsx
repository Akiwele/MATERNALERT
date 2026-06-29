import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';

import type { IosPickerRequest } from './appointment-picker-field';

type IosDateTimePickerSheetProps = {
  request: IosPickerRequest | null;
  onClose: () => void;
};

export function IosDateTimePickerSheet({ request, onClose }: IosDateTimePickerSheetProps) {
  const insets = useSafeAreaInsets();
  const [draftValue, setDraftValue] = useState(request?.value ?? new Date());

  useEffect(() => {
    if (request) {
      setDraftValue(request.value);
    }
  }, [request]);

  if (!request) {
    return null;
  }

  const handleChange = (_event: DateTimePickerEvent, selectedValue?: Date) => {
    if (selectedValue) {
      setDraftValue(selectedValue);
    }
  };

  const handleConfirm = () => {
    request.onConfirm(draftValue);
    onClose();
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.toolbar}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.toolbarTitle}>
            {request.mode === 'date' ? 'Select Date' : 'Select Time'}
          </Text>
          <Pressable onPress={handleConfirm} hitSlop={8}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={draftValue}
            mode={request.mode}
            display="spinner"
            themeVariant="light"
            textColor={BrandColors.text}
            accentColor={BrandColors.primary}
            onChange={handleChange}
            minimumDate={request.minimumDate}
            maximumDate={request.maximumDate}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 20,
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
