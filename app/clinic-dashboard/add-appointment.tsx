import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentPickerField } from '@/components/appointments/appointment-picker-field';
import { AppointmentTypeSelector } from '@/components/appointments/appointment-type-selector';
import { PrimaryButton } from '@/components/primary-button';
import type { AppointmentType } from '@/constants/appointment-types';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';

export default function AddAppointmentScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const { getPatientById, addAppointment } = useClinicData();

  const patient = patientId ? getPatientById(patientId) : undefined;
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [visitType, setVisitType] = useState<AppointmentType | null>(null);

  const handleSave = () => {
    if (!patient || !appointmentDate || !appointmentTime || !visitType) {
      Alert.alert('Missing information', 'Please complete all appointment fields.');
      return;
    }

    const scheduledTime = new Date(appointmentDate);
    scheduledTime.setHours(
      appointmentTime.getHours(),
      appointmentTime.getMinutes(),
      0,
      0,
    );

    addAppointment(patient.id, appointmentDate, scheduledTime, visitType);

    Alert.alert('Appointment added', `Appointment scheduled for ${patient.fullName}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (!patient) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Patient not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const today = new Date();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Add Appointment</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.patientMeta}>{patient.phoneNumber}</Text>

          <AppointmentPickerField
            mode="date"
            label="Appointment Date"
            value={appointmentDate}
            onChange={setAppointmentDate}
            minimumDate={today}
          />

          <AppointmentPickerField
            mode="time"
            label="Appointment Time"
            value={appointmentTime}
            onChange={setAppointmentTime}
          />

          <AppointmentTypeSelector selectedType={visitType} onSelect={setVisitType} />

          <PrimaryButton label="Save Appointment" onPress={handleSave} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: BrandColors.text,
  },
  headerSpacer: {
    width: 52,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.text,
  },
  patientMeta: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
});
