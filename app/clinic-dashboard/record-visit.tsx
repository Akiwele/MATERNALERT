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

import { AuthDateField } from '@/components/auth-date-field';
import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import { useClinicData } from '@/contexts/clinic-data-context';

export default function RecordVisitScreen() {
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const { getPatientById, recordVisit } = useClinicData();

  const patient = patientId ? getPatientById(patientId) : undefined;

  const [visitDate, setVisitDate] = useState<Date | null>(new Date());
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [nextAppointmentDate, setNextAppointmentDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!patient || !visitDate) {
      Alert.alert('Missing information', 'Please select a visit date.');
      return;
    }

    recordVisit({
      patientId: patient.id,
      visitDate,
      systolic: systolic.trim() ? parseInt(systolic, 10) : undefined,
      diastolic: diastolic.trim() ? parseInt(diastolic, 10) : undefined,
      weightKg: weightKg.trim() ? parseFloat(weightKg) : undefined,
      symptoms: symptoms.trim(),
      diagnosis: diagnosis.trim(),
      medication: medication.trim(),
      nextAppointmentDate: nextAppointmentDate ?? undefined,
      notes: notes.trim(),
    });

    Alert.alert('Visit saved', `Visit recorded for ${patient.fullName}.`, [
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
        <Text style={styles.title}>Record Visit</Text>
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

          <AuthDateField
            label="Visit Date"
            value={visitDate}
            onChange={setVisitDate}
            maximumDate={today}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <AuthTextField
                label="Systolic BP"
                placeholder="e.g. 120"
                value={systolic}
                onChangeText={setSystolic}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfField}>
              <AuthTextField
                label="Diastolic BP"
                placeholder="e.g. 80"
                value={diastolic}
                onChangeText={setDiastolic}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <AuthTextField
            label="Weight (kg)"
            placeholder="e.g. 72"
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="decimal-pad"
          />

          <AuthTextField
            label="Symptoms observed/reported"
            placeholder="Describe symptoms"
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />

          <AuthTextField
            label="Diagnosis / Assessment"
            placeholder="Clinical assessment"
            value={diagnosis}
            onChangeText={setDiagnosis}
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />

          <AuthTextField
            label="Medication given / prescribed"
            placeholder="Medication details"
            value={medication}
            onChangeText={setMedication}
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />

          <AuthDateField
            label="Next Appointment Date (optional)"
            value={nextAppointmentDate}
            onChange={setNextAppointmentDate}
            minimumDate={today}
          />

          <AuthTextField
            label="Visit Notes"
            placeholder="Additional notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.multiline}
          />

          <PrimaryButton label="Save Visit" onPress={handleSave} />
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
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
