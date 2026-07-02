import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppointmentPickerField,
  type IosPickerRequest,
} from '@/components/appointments/appointment-picker-field';
import { IosDateTimePickerSheet } from '@/components/appointments/ios-datetime-picker-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import type { ClinicAppointment } from '@/types/clinic-records';
import { formatClinicDate, formatClinicTime } from '@/utils/clinic-date-utils';

type ClinicRescheduleModalProps = {
  visible: boolean;
  appointment: ClinicAppointment | null;
  onClose: () => void;
  onConfirm: (appointmentId: string, date: Date, time: Date, notes?: string) => void;
};

function combineAppointmentDateTime(date: Date, time: Date): Date {
  const scheduledTime = new Date(date);
  scheduledTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return scheduledTime;
}

export function ClinicRescheduleModal({
  visible,
  appointment,
  onClose,
  onConfirm,
}: ClinicRescheduleModalProps) {
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [iosPickerRequest, setIosPickerRequest] = useState<IosPickerRequest | null>(null);

  useEffect(() => {
    if (!appointment || !visible) {
      return;
    }

    setAppointmentDate(new Date(appointment.date));
    setAppointmentTime(new Date(appointment.time));
    setNotes(appointment.notes ?? '');
    setDateError('');
    setTimeError('');
    setIosPickerRequest(null);
  }, [appointment, visible]);

  const handleClose = () => {
    setIosPickerRequest(null);
    onClose();
  };

  const handleSave = () => {
    if (!appointment) {
      return;
    }

    const nextDateError = appointmentDate ? '' : 'Please select a new appointment date.';
    const nextTimeError = appointmentTime ? '' : 'Please select a new appointment time.';

    setDateError(nextDateError);
    setTimeError(nextTimeError);

    if (nextDateError || nextTimeError) {
      return;
    }

    const scheduledTime = combineAppointmentDateTime(appointmentDate!, appointmentTime!);

    onConfirm(appointment.id, appointmentDate!, scheduledTime, notes);

    Alert.alert(
      'Appointment rescheduled',
      `${appointment.patientName}'s appointment has been updated successfully.`,
      [{ text: 'OK', onPress: handleClose }],
    );
  };

  if (!appointment) {
    return null;
  }

  const today = new Date();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} accessibilityLabel="Close reschedule form" />

        <SafeAreaView edges={['bottom']} style={styles.sheetSafeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <Text style={styles.title}>Reschedule Appointment</Text>
                <Pressable onPress={handleClose} hitSlop={8}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>

              <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.currentDetailsCard}>
                  <Text style={styles.sectionLabel}>Current appointment</Text>
                  <Text style={styles.patientName}>{appointment.patientName}</Text>
                  <Text style={styles.currentDetail}>{formatClinicDate(appointment.date)}</Text>
                  <Text style={styles.currentDetail}>{formatClinicTime(appointment.time)}</Text>
                  <Text style={styles.currentDetail}>{appointment.visitType}</Text>
                  {appointment.notes?.trim() ? (
                    <Text style={styles.currentNotes}>Notes: {appointment.notes.trim()}</Text>
                  ) : null}
                </View>

                {appointment.status === 'reschedule_requested' ? (
                  <Text style={styles.requestNote}>Patient requested a reschedule.</Text>
                ) : null}

                <AppointmentPickerField
                  mode="date"
                  label="New Appointment Date"
                  value={appointmentDate}
                  onChange={(value) => {
                    setAppointmentDate(value);
                    setDateError('');
                  }}
                  error={dateError}
                  minimumDate={today}
                  onRequestIosPicker={setIosPickerRequest}
                />

                <AppointmentPickerField
                  mode="time"
                  label="New Appointment Time"
                  value={appointmentTime}
                  onChange={(value) => {
                    setAppointmentTime(value);
                    setTimeError('');
                  }}
                  error={timeError}
                  onRequestIosPicker={setIosPickerRequest}
                />

                <View style={styles.notesField}>
                  <Text style={styles.notesLabel}>Notes / Reason (optional)</Text>
                  <TextInput
                    style={styles.notesInput}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="e.g. Clinic rescheduled due to provider availability"
                    placeholderTextColor={BrandColors.textSecondary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <PrimaryButton label="Save New Date" onPress={handleSave} />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {Platform.OS === 'ios' ? (
          <IosDateTimePickerSheet
            request={iosPickerRequest}
            onClose={() => setIosPickerRequest(null)}
          />
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheetSafeArea: {
    maxHeight: '92%',
  },
  keyboardView: {
    width: '100%',
  },
  sheet: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  currentDetailsCard: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    padding: 14,
    gap: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  currentDetail: {
    fontSize: 14,
    color: BrandColors.text,
  },
  currentNotes: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  requestNote: {
    fontSize: 14,
    color: '#B45309',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  notesField: {
    gap: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  notesInput: {
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: BrandColors.text,
  },
});
