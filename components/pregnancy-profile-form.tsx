import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AuthDateField } from '@/components/auth-date-field';
import { AuthTextField } from '@/components/auth-text-field';
import { BloodGroupSelector } from '@/components/blood-group-selector';
import { MedicalHistorySelector } from '@/components/medical-history-selector';
import { PrimaryButton } from '@/components/primary-button';
import { RelationshipSelector } from '@/components/relationship-selector';
import { YesNoSelector } from '@/components/yes-no-selector';
import { BloodGroup } from '@/constants/blood-groups';
import { EmergencyContactRelationship } from '@/constants/emergency-contact-relationships';
import { MedicalCondition, getRiskStatusFromConditions } from '@/constants/medical-conditions';
import type { EmergencyContact, ObstetricHistory, PatientProfile } from '@/stores/patient-profile';

export type PregnancyProfileFormMode = 'setup' | 'edit-pregnancy';

export type PregnancyProfileFormResult = {
  dateOfBirth?: Date;
  emergencyContact?: EmergencyContact | null;
  lmpDate: Date;
  isFirstPregnancy: boolean;
  obstetricHistory: ObstetricHistory | null;
  heightCm: number;
  weightKg: number;
  bloodGroup?: BloodGroup | null;
  allergies: string;
  medicalConditions: MedicalCondition[];
  otherConditionDetails: string;
  riskStatus: string;
};

type PregnancyProfileFormProps = {
  mode: PregnancyProfileFormMode;
  initialProfile?: PatientProfile | null;
  onSubmit: (result: PregnancyProfileFormResult) => void;
  submitLabel: string;
};

export function PregnancyProfileForm({
  mode,
  initialProfile,
  onSubmit,
  submitLabel,
}: PregnancyProfileFormProps) {
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(initialProfile?.dateOfBirth ?? null);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    initialProfile?.emergencyContact?.phoneNumber ?? '',
  );
  const [emergencyContactName, setEmergencyContactName] = useState(
    initialProfile?.emergencyContact?.name ?? '',
  );
  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    useState<EmergencyContactRelationship | null>(
      initialProfile?.emergencyContact?.relationship ?? null,
    );
  const [pregnancyStartDate, setPregnancyStartDate] = useState<Date | null>(
    initialProfile?.lmpDate ?? null,
  );
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean | null>(
    initialProfile?.isFirstPregnancy ?? null,
  );
  const [previousPregnancies, setPreviousPregnancies] = useState(
    initialProfile?.obstetricHistory?.previousPregnancies.toString() ?? '',
  );
  const [livingChildren, setLivingChildren] = useState(
    initialProfile?.obstetricHistory?.livingChildren.toString() ?? '',
  );
  const [previousMiscarriages, setPreviousMiscarriages] = useState(
    initialProfile?.obstetricHistory?.previousMiscarriages.toString() ?? '',
  );
  const [previousInducedAbortions, setPreviousInducedAbortions] = useState(
    initialProfile?.obstetricHistory?.previousInducedAbortions.toString() ?? '',
  );
  const [previousStillbirths, setPreviousStillbirths] = useState(
    initialProfile?.obstetricHistory?.previousStillbirths?.toString() ?? '',
  );
  const [heightCm, setHeightCm] = useState(initialProfile?.heightCm.toString() ?? '');
  const [weightKg, setWeightKg] = useState(initialProfile?.weightKg.toString() ?? '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | null>(
    initialProfile?.bloodGroup ?? null,
  );
  const [selectedConditions, setSelectedConditions] = useState<MedicalCondition[]>(
    initialProfile?.medicalConditions ?? [],
  );
  const [otherConditionDetails, setOtherConditionDetails] = useState(
    initialProfile?.otherConditionDetails ?? '',
  );
  const [allergies, setAllergies] = useState(initialProfile?.allergies ?? '');

  const showEmergencyContactDetails = emergencyContactPhone.trim().length > 0;
  const showSetupFields = mode === 'setup';

  const today = useMemo(() => new Date(), []);
  const minDateOfBirth = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 55);
    return date;
  }, []);
  const minLmpDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 294);
    return date;
  }, []);

  const handleEmergencyPhoneChange = (value: string) => {
    setEmergencyContactPhone(value);
    if (!value.trim()) {
      setEmergencyContactName('');
      setEmergencyContactRelationship(null);
    }
  };

  const handleFirstPregnancyChange = (value: boolean) => {
    setIsFirstPregnancy(value);
    if (value) {
      setPreviousPregnancies('');
      setLivingChildren('');
      setPreviousMiscarriages('');
      setPreviousInducedAbortions('');
      setPreviousStillbirths('');
    }
  };

  const toggleCondition = (condition: MedicalCondition) => {
    setSelectedConditions((current) => {
      if (condition === 'None') {
        if (current.includes('None')) {
          return [];
        }
        setOtherConditionDetails('');
        return ['None'];
      }

      if (current.includes(condition)) {
        if (condition === 'Other') {
          setOtherConditionDetails('');
        }
        return current.filter((item) => item !== condition);
      }

      return [...current.filter((item) => item !== 'None'), condition];
    });
  };

  const handleSubmit = () => {
    if (showSetupFields && !dateOfBirth) {
      Alert.alert('Missing information', 'Please select your date of birth.');
      return;
    }

    if (!pregnancyStartDate || isFirstPregnancy === null) {
      Alert.alert('Missing information', 'Please complete all required pregnancy fields.');
      return;
    }

    if (showSetupFields && showEmergencyContactDetails) {
      if (!emergencyContactName.trim() || !emergencyContactRelationship) {
        Alert.alert(
          'Emergency contact details required',
          'Please provide the emergency contact name and relationship.',
        );
        return;
      }
    }

    if (!isFirstPregnancy) {
      if (
        !previousPregnancies.trim() ||
        !livingChildren.trim() ||
        !previousMiscarriages.trim() ||
        !previousInducedAbortions.trim()
      ) {
        Alert.alert(
          'Obstetric history required',
          'Please complete your previous pregnancy details.',
        );
        return;
      }
    }

    if (!heightCm.trim() || !weightKg.trim()) {
      Alert.alert('Physical measurements required', 'Please enter your height and weight.');
      return;
    }

    const height = parseFloat(heightCm);
    const weight = parseFloat(weightKg);
    if (height <= 0 || weight <= 0) {
      Alert.alert('Invalid measurements', 'Please enter valid height and weight values.');
      return;
    }

    if (selectedConditions.length === 0) {
      Alert.alert(
        'Medical conditions required',
        'Please select at least one option under Existing Medical Conditions.',
      );
      return;
    }

    if (selectedConditions.includes('Other') && !otherConditionDetails.trim()) {
      Alert.alert('Other condition required', 'Please specify your other medical condition.');
      return;
    }

    onSubmit({
      ...(showSetupFields && dateOfBirth ? { dateOfBirth } : {}),
      ...(showSetupFields
        ? {
            emergencyContact: showEmergencyContactDetails
              ? {
                  phoneNumber: emergencyContactPhone.trim(),
                  name: emergencyContactName.trim(),
                  relationship: emergencyContactRelationship!,
                }
              : null,
            bloodGroup,
          }
        : {}),
      lmpDate: pregnancyStartDate,
      isFirstPregnancy,
      obstetricHistory: isFirstPregnancy
        ? null
        : {
            previousPregnancies: parseInt(previousPregnancies, 10),
            livingChildren: parseInt(livingChildren, 10),
            previousMiscarriages: parseInt(previousMiscarriages, 10),
            previousInducedAbortions: parseInt(previousInducedAbortions, 10),
            previousStillbirths: previousStillbirths.trim()
              ? parseInt(previousStillbirths, 10)
              : undefined,
          },
      heightCm: height,
      weightKg: weight,
      allergies: allergies.trim(),
      medicalConditions: selectedConditions,
      otherConditionDetails: otherConditionDetails.trim(),
      riskStatus: getRiskStatusFromConditions(selectedConditions),
    });
  };

  return (
    <View style={styles.form}>
      {showSetupFields ? (
        <>
          <AuthDateField
            label="Date of Birth"
            placeholder="Select your date of birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
            maximumDate={today}
            minimumDate={minDateOfBirth}
          />

          <AuthTextField
            label="Emergency Contact Phone Number (Optional)"
            placeholder="e.g. 055 987 6543"
            value={emergencyContactPhone}
            onChangeText={handleEmergencyPhoneChange}
            keyboardType="phone-pad"
          />

          {showEmergencyContactDetails ? (
            <>
              <AuthTextField
                label="Emergency Contact Name"
                placeholder="Enter emergency contact name"
                value={emergencyContactName}
                onChangeText={setEmergencyContactName}
                autoCapitalize="words"
              />
              <RelationshipSelector
                selectedRelationship={emergencyContactRelationship}
                onSelect={setEmergencyContactRelationship}
              />
            </>
          ) : null}
        </>
      ) : null}

      <AuthDateField
        label="Last Menstrual Period (LMP) / Pregnancy Start Date"
        placeholder="Select last menstrual period date"
        value={pregnancyStartDate}
        onChange={setPregnancyStartDate}
        maximumDate={today}
        minimumDate={minLmpDate}
      />

      <YesNoSelector
        label="Is this your first pregnancy?"
        value={isFirstPregnancy}
        onChange={handleFirstPregnancyChange}
      />

      {isFirstPregnancy === false ? (
        <>
          <AuthTextField
            label="Number of previous pregnancies"
            placeholder="e.g. 1"
            value={previousPregnancies}
            onChangeText={setPreviousPregnancies}
            keyboardType="number-pad"
          />
          <AuthTextField
            label="Number of living children"
            placeholder="e.g. 1"
            value={livingChildren}
            onChangeText={setLivingChildren}
            keyboardType="number-pad"
          />
          <AuthTextField
            label="Previous miscarriages (spontaneous abortions)"
            placeholder="e.g. 0"
            value={previousMiscarriages}
            onChangeText={setPreviousMiscarriages}
            keyboardType="number-pad"
          />
          <AuthTextField
            label="Previous induced abortions"
            placeholder="e.g. 0"
            value={previousInducedAbortions}
            onChangeText={setPreviousInducedAbortions}
            keyboardType="number-pad"
          />
          <AuthTextField
            label="Previous stillbirths (optional)"
            placeholder="e.g. 0"
            value={previousStillbirths}
            onChangeText={setPreviousStillbirths}
            keyboardType="number-pad"
          />
        </>
      ) : null}

      <AuthTextField
        label="Height (cm)"
        placeholder="e.g. 165"
        value={heightCm}
        onChangeText={setHeightCm}
        keyboardType="decimal-pad"
      />

      <AuthTextField
        label="Current Weight (kg)"
        placeholder="e.g. 68"
        value={weightKg}
        onChangeText={setWeightKg}
        keyboardType="decimal-pad"
      />

      {showSetupFields ? (
        <BloodGroupSelector
          selectedBloodGroup={bloodGroup}
          onSelect={setBloodGroup}
          label="Blood Group"
        />
      ) : null}

      <MedicalHistorySelector
        selectedConditions={selectedConditions}
        onToggle={toggleCondition}
        otherDetails={otherConditionDetails}
        onOtherDetailsChange={setOtherConditionDetails}
      />

      <AuthTextField
        label="Allergies (optional)"
        placeholder="List any known allergies"
        value={allergies}
        onChangeText={setAllergies}
        multiline
        numberOfLines={4}
        style={styles.allergiesInput}
      />

      <View style={styles.buttonContainer}>
        <PrimaryButton label={submitLabel} onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
  allergiesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 8,
  },
});
