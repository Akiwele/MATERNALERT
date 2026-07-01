import { useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import {
  HEALTH_SYMPTOMS,
  isSymptomChipDisabled,
  toggleHealthSymptom,
  type HealthSymptom,
} from '@/constants/health-symptoms';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { SaveHealthRecordInput } from '@/types/health';
import {
  buildSaveHealthRecordInput,
  createEmptyHealthLogForm,
  type HealthLogFocusSection,
} from '@/utils/health-log-form';

export type { HealthLogFocusSection };

export type LogHealthRecordModalMode = 'full' | HealthLogFocusSection;

type LogHealthRecordModalProps = {
  visible: boolean;
  mode?: LogHealthRecordModalMode;
  initialWeight?: number | null;
  onClose: () => void;
  onSave: (input: SaveHealthRecordInput) => void;
};

const MODAL_TITLES: Record<LogHealthRecordModalMode, string> = {
  full: 'Log Health Record',
  bloodPressure: 'Log Blood Pressure',
  weight: 'Log Weight',
  symptoms: 'Log Symptoms',
  medication: 'Log Medication',
};

const SAVE_LABELS: Record<LogHealthRecordModalMode, string> = {
  full: 'Save Health Record',
  bloodPressure: 'Save Blood Pressure',
  weight: 'Save Weight',
  symptoms: 'Save Symptoms',
  medication: 'Save Medication',
};

const EMPTY_MESSAGES: Record<HealthLogFocusSection, string> = {
  bloodPressure: 'Enter your systolic and diastolic blood pressure before saving.',
  weight: 'Enter your weight before saving.',
  symptoms: 'Select at least one symptom before saving.',
  medication: 'Enter medication details before saving.',
};

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function LogHealthRecordModal({
  visible,
  mode = 'full',
  initialWeight = null,
  onClose,
  onSave,
}: LogHealthRecordModalProps) {
  const [form, setForm] = useState(() => createEmptyHealthLogForm(initialWeight));

  useEffect(() => {
    if (visible) {
      setForm(createEmptyHealthLogForm(initialWeight));
    }
  }, [visible, initialWeight]);

  const showBloodPressure = mode === 'full' || mode === 'bloodPressure';
  const showWeight = mode === 'full' || mode === 'weight';
  const showSymptoms = mode === 'full' || mode === 'symptoms';
  const showMedication = mode === 'full' || mode === 'medication';
  const showGeneralNotes = mode === 'full';

  const toggleSymptom = (symptom: HealthSymptom) => {
    if (isSymptomChipDisabled(form.selectedSymptoms, symptom)) {
      return;
    }

    setForm((current) => {
      const nextSymptoms = toggleHealthSymptom(current.selectedSymptoms, symptom);

      return {
        ...current,
        selectedSymptoms: nextSymptoms,
        otherSymptomDetails:
          nextSymptoms.includes('None') || !nextSymptoms.includes('Other')
            ? ''
            : current.otherSymptomDetails,
      };
    });
  };

  const handleSave = () => {
    try {
      const input = buildSaveHealthRecordInput(form, mode === 'full' ? undefined : mode);

      if (!input) {
        const message =
          mode === 'full'
            ? 'Enter at least one health detail before saving your record.'
            : EMPTY_MESSAGES[mode];

        Alert.alert('Nothing to save', message);
        return;
      }

      onSave(input);
      onClose();
    } catch (error) {
      Alert.alert(
        'Invalid information',
        error instanceof Error ? error.message : 'Please check your entries and try again.',
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerSafe}>
            <View style={styles.header}>
              <Text style={styles.title}>{MODAL_TITLES[mode]}</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>
          </SafeAreaView>

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {showBloodPressure ? (
                <FormSection title="Blood Pressure">
                  <View style={styles.row}>
                    <View style={styles.halfField}>
                      <AuthTextField
                        label="Systolic"
                        placeholder="e.g. 120"
                        value={form.systolic}
                        onChangeText={(systolic) => setForm((current) => ({ ...current, systolic }))}
                        keyboardType="number-pad"
                      />
                    </View>
                    <View style={styles.halfField}>
                      <AuthTextField
                        label="Diastolic"
                        placeholder="e.g. 80"
                        value={form.diastolic}
                        onChangeText={(diastolic) =>
                          setForm((current) => ({ ...current, diastolic }))
                        }
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                </FormSection>
              ) : null}

              {showWeight ? (
                <FormSection title="Weight">
                  <AuthTextField
                    label="Weight (kg)"
                    placeholder="e.g. 72.4"
                    value={form.weight}
                    onChangeText={(weight) => setForm((current) => ({ ...current, weight }))}
                    keyboardType="decimal-pad"
                  />
                </FormSection>
              ) : null}

              {showSymptoms ? (
                <FormSection title="Symptoms">
                  <Text style={styles.helperText}>Select any symptoms you are experiencing.</Text>
                  <View style={styles.chipGrid}>
                    {HEALTH_SYMPTOMS.map((symptom) => {
                      const isSelected = form.selectedSymptoms.includes(symptom);
                      const isDisabled = isSymptomChipDisabled(form.selectedSymptoms, symptom);

                      return (
                        <Pressable
                          key={symptom}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                            isDisabled && styles.chipDisabled,
                          ]}
                          onPress={() => toggleSymptom(symptom)}
                          disabled={isDisabled}>
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                              isDisabled && styles.chipTextDisabled,
                            ]}>
                            {symptom}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {form.selectedSymptoms.includes('Other') ? (
                    <AuthTextField
                      label="Other symptom details"
                      placeholder="Describe your other symptom"
                      value={form.otherSymptomDetails}
                      onChangeText={(otherSymptomDetails) =>
                        setForm((current) => ({ ...current, otherSymptomDetails }))
                      }
                      multiline
                      numberOfLines={3}
                      style={styles.notesInput}
                    />
                  ) : null}
                </FormSection>
              ) : null}

              {showMedication ? (
                <FormSection
                  title={mode === 'full' ? 'Medication (optional)' : 'Medication'}>
                  <AuthTextField
                    label="Medication Name"
                    placeholder="e.g. Folic Acid"
                    value={form.medicationName}
                    onChangeText={(medicationName) =>
                      setForm((current) => ({ ...current, medicationName }))
                    }
                  />
                  <AuthTextField
                    label="Dosage"
                    placeholder="e.g. 5 mg"
                    value={form.medicationDosage}
                    onChangeText={(medicationDosage) =>
                      setForm((current) => ({ ...current, medicationDosage }))
                    }
                  />
                  <AuthTextField
                    label="Frequency"
                    placeholder="e.g. Once daily"
                    value={form.medicationFrequency}
                    onChangeText={(medicationFrequency) =>
                      setForm((current) => ({ ...current, medicationFrequency }))
                    }
                  />
                  <AuthTextField
                    label="Notes (optional)"
                    placeholder="Any medication instructions"
                    value={form.medicationNotes}
                    onChangeText={(medicationNotes) =>
                      setForm((current) => ({ ...current, medicationNotes }))
                    }
                    multiline
                    numberOfLines={3}
                    style={styles.notesInput}
                  />
                </FormSection>
              ) : null}

              {showGeneralNotes ? (
                <FormSection title="General Notes">
                  <AuthTextField
                    label="Additional Notes (optional)"
                    placeholder="Any other health notes for today"
                    value={form.generalNotes}
                    onChangeText={(generalNotes) =>
                      setForm((current) => ({ ...current, generalNotes }))
                    }
                    multiline
                    numberOfLines={4}
                    style={styles.notesInput}
                  />
                </FormSection>
              ) : null}
            </ScrollView>
          </KeyboardAvoidingView>

          <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.footerSafe}>
            <View style={styles.footer}>
              <PrimaryButton label={SAVE_LABELS[mode]} onPress={handleSave} />
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.background,
  },
  headerSafe: {
    backgroundColor: BrandColors.white,
  },
  footerSafe: {
    backgroundColor: BrandColors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
    backgroundColor: BrandColors.white,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  section: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '700',
    color: BrandColors.primaryDark,
  },
  sectionBody: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  helperText: {
    fontSize: PatientDashboardTypography.label,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
  chipSelected: {
    borderColor: BrandColors.primary,
    backgroundColor: BrandColors.primaryMuted,
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipText: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '500',
    color: BrandColors.text,
  },
  chipTextSelected: {
    color: BrandColors.primaryDark,
    fontWeight: '600',
  },
  chipTextDisabled: {
    color: BrandColors.textSecondary,
  },
  notesInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
});
