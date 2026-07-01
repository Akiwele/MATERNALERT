import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentPickerField } from '@/components/appointments/appointment-picker-field';
import { AppointmentTypeSelector } from '@/components/appointments/appointment-type-selector';
import { ClinicPatientPicker } from '@/components/clinic/clinic-patient-picker';
import { PrimaryButton } from '@/components/primary-button';
import type { AppointmentType } from '@/constants/appointment-types';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';

export default function AddAppointmentScreen() {
  const router = useRouter();
  const { patientId: initialPatientId } = useLocalSearchParams<{ patientId?: string }>();
  const { getPatientById, getAccessiblePatients, addAppointment } = useClinicData();

  const accessiblePatients = useMemo(() => getAccessiblePatients(), [getAccessiblePatients]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    initialPatientId ?? null,
  );
  const patient = selectedPatientId ? getPatientById(selectedPatientId) : undefined;
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [visitType, setVisitType] = useState<AppointmentType | null>(null);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!patient || !appointmentDate || !appointmentTime || !visitType) {
      Alert.alert('Missing information', 'Please complete all required appointment fields.');
      return;
    }

    const scheduledTime = new Date(appointmentDate);
    scheduledTime.setHours(
      appointmentTime.getHours(),
      appointmentTime.getMinutes(),
      0,
      0,
    );

    addAppointment(patient.id, appointmentDate, scheduledTime, visitType, notes);

    Alert.alert('Appointment added', `Appointment scheduled for ${patient.fullName}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

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
          {initialPatientId && patient ? (
            <>
              <Text style={styles.patientName}>{patient.fullName}</Text>
              <Text style={styles.patientMeta}>{patient.phoneNumber}</Text>
            </>
          ) : (
            <ClinicPatientPicker
              patients={accessiblePatients}
              selectedPatientId={selectedPatientId}
              onSelect={setSelectedPatientId}
            />
          )}

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

          <View style={styles.notesField}>
            <Text style={styles.notesLabel}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Bring ANC book and lab results"
              placeholderTextColor={BrandColors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

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
