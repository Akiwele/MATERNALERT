import { useEffect, useRef, useState, type ReactNode } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { BrandColors } from '@/constants/brand';
import { HEALTH_SYMPTOMS, type HealthSymptom } from '@/constants/health-symptoms';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { SaveHealthRecordInput } from '@/types/health';
import {
  buildSaveHealthRecordInput,
  createEmptyHealthLogForm,
  type HealthLogFocusSection,
} from '@/utils/health-log-form';

export type { HealthLogFocusSection };

type LogHealthRecordModalProps = {
  visible: boolean;
  initialSection?: HealthLogFocusSection | null;
  initialWeight?: number | null;
  onClose: () => void;
  onSave: (input: SaveHealthRecordInput) => void;
};

type SectionKey = HealthLogFocusSection | 'generalNotes';

function FormSection({
  title,
  children,
  onLayout,
}: {
  title: string;
  children: ReactNode;
  onLayout?: (y: number) => void;
}) {
  return (
    <View
      style={styles.section}
      onLayout={(event) => onLayout?.(event.nativeEvent.layout.y)}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function LogHealthRecordModal({
  visible,
  initialSection = null,
  initialWeight = null,
  onClose,
  onSave,
}: LogHealthRecordModalProps) {
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Partial<Record<SectionKey, number>>>({});
  const [form, setForm] = useState(() => createEmptyHealthLogForm(initialWeight));

  useEffect(() => {
    if (visible) {
      setForm(createEmptyHealthLogForm(initialWeight));
    }
  }, [visible, initialWeight]);

  useEffect(() => {
    if (!visible || !initialSection) {
      return;
    }

    const timer = setTimeout(() => {
      const offset = sectionOffsets.current[initialSection];

      if (offset !== undefined) {
        scrollRef.current?.scrollTo({ y: Math.max(offset - 12, 0), animated: true });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [visible, initialSection]);

  const rememberSectionOffset = (key: SectionKey) => (y: number) => {
    sectionOffsets.current[key] = y;
  };

  const toggleSymptom = (symptom: HealthSymptom) => {
    setForm((current) => ({
      ...current,
      selectedSymptoms: current.selectedSymptoms.includes(symptom)
        ? current.selectedSymptoms.filter((item) => item !== symptom)
        : [...current.selectedSymptoms, symptom],
    }));
  };

  const handleSave = () => {
    try {
      const input = buildSaveHealthRecordInput(form);

      if (!input) {
        Alert.alert(
          'Nothing to save',
          'Enter at least one health detail before saving your record.',
        );
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
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Log Health Record</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <FormSection
              title="Blood Pressure"
              onLayout={rememberSectionOffset('bloodPressure')}>
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
                    onChangeText={(diastolic) => setForm((current) => ({ ...current, diastolic }))}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </FormSection>

            <FormSection title="Weight" onLayout={rememberSectionOffset('weight')}>
              <AuthTextField
                label="Weight (kg)"
                placeholder="e.g. 72.4"
                value={form.weight}
                onChangeText={(weight) => setForm((current) => ({ ...current, weight }))}
                keyboardType="decimal-pad"
              />
            </FormSection>

            <FormSection title="Symptoms" onLayout={rememberSectionOffset('symptoms')}>
              <Text style={styles.helperText}>Select any symptoms you are experiencing.</Text>
              <View style={styles.chipGrid}>
                {HEALTH_SYMPTOMS.map((symptom) => {
                  const isSelected = form.selectedSymptoms.includes(symptom);

                  return (
                    <Pressable
                      key={symptom}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleSymptom(symptom)}>
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
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

            <FormSection title="Medication" onLayout={rememberSectionOffset('medication')}>
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

            <FormSection title="General Notes" onLayout={rememberSectionOffset('generalNotes')}>
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
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <PrimaryButton label="Save Health Record" onPress={handleSave} />
        </View>
      </SafeAreaView>
    </Modal>
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
  chipText: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '500',
    color: BrandColors.text,
  },
  chipTextSelected: {
    color: BrandColors.primaryDark,
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    borderTopWidth: 1,
    borderTopColor: BrandColors.border,
    backgroundColor: BrandColors.white,
  },
});
