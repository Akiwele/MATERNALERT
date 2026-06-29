import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarDays, Clock3 } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import { formatAppointmentDate, formatAppointmentTime } from '@/utils/appointments';

export type IosPickerRequest = {
  mode: 'date' | 'time';
  value: Date;
  onConfirm: (value: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

type AppointmentPickerFieldProps = {
  mode: 'date' | 'time';
  label: string;
  value: Date | null;
  onChange: (value: Date) => void;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  onRequestIosPicker?: (request: IosPickerRequest) => void;
};

export function AppointmentPickerField({
  mode,
  label,
  value,
  onChange,
  error,
  minimumDate,
  maximumDate,
  onRequestIosPicker,
}: AppointmentPickerFieldProps) {
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  const placeholder = mode === 'date' ? 'Select date' : 'Select time';
  const Icon = mode === 'date' ? CalendarDays : Clock3;

  const displayValue = value
    ? mode === 'date'
      ? formatAppointmentDate(value.toISOString())
      : formatAppointmentTime(value.toISOString())
    : placeholder;

  const openPicker = () => {
    if (Platform.OS === 'ios') {
      onRequestIosPicker?.({
        mode,
        value: value ?? new Date(),
        onConfirm: onChange,
        minimumDate,
        maximumDate,
      });
      return;
    }

    setShowAndroidPicker(true);
  };

  const handleAndroidChange = (event: DateTimePickerEvent, selectedValue?: Date) => {
    setShowAndroidPicker(false);

    if (event.type === 'dismissed' || !selectedValue) {
      return;
    }

    onChange(selectedValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={styles.selector} onPress={openPicker}>
        <Text style={[styles.selectorText, !value && styles.placeholder]}>{displayValue}</Text>
        <Icon size={20} color={BrandColors.primary} />
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {Platform.OS === 'android' && showAndroidPicker ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode={mode}
          display="default"
          onChange={handleAndroidChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: PatientDashboardTypography.label,
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
  },
  selectorText: {
    flex: 1,
    fontSize: PatientDashboardTypography.body,
    color: BrandColors.text,
    marginRight: 8,
  },
  placeholder: {
    color: BrandColors.textSecondary,
  },
  error: {
    fontSize: PatientDashboardTypography.caption,
    color: '#B91C1C',
    lineHeight: 20,
  },
});
