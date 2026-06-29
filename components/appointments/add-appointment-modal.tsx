import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppointmentClinicField } from '@/components/appointments/appointment-clinic-field';
import {
  AppointmentPickerField,
  type IosPickerRequest,
} from '@/components/appointments/appointment-picker-field';
import { AppointmentTypeSelector } from '@/components/appointments/appointment-type-selector';
import { IosDateTimePickerSheet } from '@/components/appointments/ios-datetime-picker-sheet';
import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import type { AppointmentType } from '@/constants/appointment-types';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { Clinic } from '@/constants/clinics';
import {
  getPatientRegistration,
  updatePatientClinic,
} from '@/stores/patient-registration';
import type { AntenatalAppointmentInput } from '@/utils/appointments';
import { transferPatientToClinic } from '@/utils/sync-patient-care-network';

type AddAppointmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (input: AntenatalAppointmentInput) => void;
};

type FormErrors = {
  clinic?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentType?: string;
};

const createInitialForm = () => ({
  appointmentDate: null as Date | null,
  appointmentTime: null as Date | null,
  appointmentType: null as AppointmentType | null,
  notes: '',
});

export function AddAppointmentModal({ visible, onClose, onSave }: AddAppointmentModalProps) {
  const [form, setForm] = useState(createInitialForm);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [iosPickerRequest, setIosPickerRequest] = useState<IosPickerRequest | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedClinic(getPatientRegistration()?.clinic ?? null);
      setForm(createInitialForm());
      setErrors({});
      setIosPickerRequest(null);
    }
  }, [visible]);

  const handleClose = () => {
    setForm(createInitialForm());
    setErrors({});
    setIosPickerRequest(null);
    onClose();
  };

  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    updatePatientClinic(clinic);
    transferPatientToClinic(clinic.name);

    if (errors.clinic) {
      setErrors((current) => ({ ...current, clinic: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!selectedClinic) {
      nextErrors.clinic = 'Please select your clinic before saving.';
    }

    if (!form.appointmentDate) {
      nextErrors.appointmentDate = 'Appointment date is required.';
    }

    if (!form.appointmentTime) {
      nextErrors.appointmentTime = 'Appointment time is required.';
    }

    if (!form.appointmentType) {
      nextErrors.appointmentType = 'Please select an appointment type.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (
      !validateForm() ||
      !selectedClinic ||
      !form.appointmentDate ||
      !form.appointmentTime ||
      !form.appointmentType
    ) {
      return;
    }

    onSave({
      clinicName: selectedClinic.name,
      appointmentDate: form.appointmentDate.toISOString(),
      appointmentTime: form.appointmentTime.toISOString(),
      appointmentType: form.appointmentType,
      notes: form.notes.trim() || undefined,
    });

    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Appointment</Text>
              <Pressable onPress={handleClose} hitSlop={8}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <AppointmentClinicField
                clinic={selectedClinic}
                onSelectClinic={handleSelectClinic}
                error={errors.clinic}
              />

              <AppointmentPickerField
                mode="date"
                label="Appointment Date"
                value={form.appointmentDate}
                onChange={(appointmentDate) => {
                  setForm((current) => ({ ...current, appointmentDate }));
                  if (errors.appointmentDate) {
                    setErrors((current) => ({ ...current, appointmentDate: undefined }));
                  }
                }}
                error={errors.appointmentDate}
                onRequestIosPicker={setIosPickerRequest}
              />

              <AppointmentPickerField
                mode="time"
                label="Appointment Time"
                value={form.appointmentTime}
                onChange={(appointmentTime) => {
                  setForm((current) => ({ ...current, appointmentTime }));
                  if (errors.appointmentTime) {
                    setErrors((current) => ({ ...current, appointmentTime: undefined }));
                  }
                }}
                error={errors.appointmentTime}
                onRequestIosPicker={setIosPickerRequest}
              />

              <AppointmentTypeSelector
                selectedType={form.appointmentType}
                onSelect={(appointmentType) => {
                  setForm((current) => ({ ...current, appointmentType }));
                  if (errors.appointmentType) {
                    setErrors((current) => ({ ...current, appointmentType: undefined }));
                  }
                }}
                error={errors.appointmentType}
              />

              <AuthTextField
                label="Notes (optional)"
                placeholder="Add any notes from your clinic"
                value={form.notes}
                onChangeText={(notes) => setForm((current) => ({ ...current, notes }))}
                multiline
                numberOfLines={3}
                style={styles.notesInput}
              />

              <PrimaryButton label="Save Appointment" onPress={handleSave} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    maxHeight: '88%',
  },
  sheet: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 18,
    paddingBottom: Platform.OS === 'ios' ? 28 : 20,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  title: {
    fontSize: PatientDashboardTypography.sectionHeading,
    fontWeight: '700',
    color: BrandColors.text,
  },
  closeText: {
    fontSize: PatientDashboardTypography.body,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    gap: 16,
  },
  notesInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
