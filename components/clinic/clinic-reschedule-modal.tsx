import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppointmentPickerField } from '@/components/appointments/appointment-picker-field';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import type { ClinicAppointment } from '@/types/clinic-records';

type ClinicRescheduleModalProps = {
  visible: boolean;
  appointment: ClinicAppointment | null;
  onClose: () => void;
  onConfirm: (appointmentId: string, date: Date, time: Date) => void;
};

export function ClinicRescheduleModal({
  visible,
  appointment,
  onClose,
  onConfirm,
}: ClinicRescheduleModalProps) {
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);

  useEffect(() => {
    if (appointment && visible) {
      setAppointmentDate(new Date(appointment.date));
      setAppointmentTime(new Date(appointment.time));
    }
  }, [appointment, visible]);

  const handleSave = () => {
    if (!appointment || !appointmentDate || !appointmentTime) {
      Alert.alert('Missing information', 'Please select a new date and time.');
      return;
    }

    const scheduledTime = new Date(appointmentDate);
    scheduledTime.setHours(
      appointmentTime.getHours(),
      appointmentTime.getMinutes(),
      0,
      0,
    );

    onConfirm(appointment.id, appointmentDate, scheduledTime);
    onClose();
  };

  if (!appointment) {
    return null;
  }

  const today = new Date();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Reschedule Appointment</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          <Text style={styles.patientName}>{appointment.patientName}</Text>
          {appointment.status === 'reschedule_requested' ? (
            <Text style={styles.requestNote}>Patient requested a reschedule.</Text>
          ) : null}

          <AppointmentPickerField
            mode="date"
            label="New Appointment Date"
            value={appointmentDate}
            onChange={setAppointmentDate}
            minimumDate={today}
          />

          <AppointmentPickerField
            mode="time"
            label="New Appointment Time"
            value={appointmentTime}
            onChange={setAppointmentTime}
          />

          <PrimaryButton label="Save New Date" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
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
});
