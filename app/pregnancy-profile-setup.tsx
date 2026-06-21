import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthDateField } from '@/components/auth-date-field';
import { AuthTextField } from '@/components/auth-text-field';
import { BloodGroupSelector } from '@/components/blood-group-selector';
import { MedicalHistorySelector } from '@/components/medical-history-selector';
import { PrimaryButton } from '@/components/primary-button';
import { RelationshipSelector } from '@/components/relationship-selector';
import { YesNoSelector } from '@/components/yes-no-selector';
import { BrandColors } from '@/constants/brand';
import { BloodGroup } from '@/constants/blood-groups';
import { EmergencyContactRelationship } from '@/constants/emergency-contact-relationships';
import { MedicalCondition, getRiskStatusFromConditions } from '@/constants/medical-conditions';
import { setPatientProfile } from '@/stores/patient-profile';

function useResponsiveSpacing(screenHeight: number) {
  return useMemo(() => {
    const isCompact = screenHeight < 700;
    const isMedium = screenHeight < 850;

    if (isCompact) {
      return { scrollPaddingTop: 4, scrollPaddingBottom: 24, headerToForm: 20, fieldGap: 16 };
    }

    if (isMedium) {
      return { scrollPaddingTop: 8, scrollPaddingBottom: 28, headerToForm: 24, fieldGap: 18 };
    }

    return { scrollPaddingTop: 12, scrollPaddingBottom: 32, headerToForm: 28, fieldGap: 18 };
  }, [screenHeight]);
}

export default function PregnancyProfileSetupScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const spacing = useResponsiveSpacing(screenHeight);

  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    useState<EmergencyContactRelationship | null>(null);
  const [pregnancyStartDate, setPregnancyStartDate] = useState<Date | null>(null);
  const [isFirstPregnancy, setIsFirstPregnancy] = useState<boolean | null>(null);
  const [previousPregnancies, setPreviousPregnancies] = useState('');
  const [livingChildren, setLivingChildren] = useState('');
  const [previousMiscarriages, setPreviousMiscarriages] = useState('');
  const [previousInducedAbortions, setPreviousInducedAbortions] = useState('');
  const [previousStillbirths, setPreviousStillbirths] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<MedicalCondition[]>([]);
  const [otherConditionDetails, setOtherConditionDetails] = useState('');
  const [allergies, setAllergies] = useState('');

  const showEmergencyContactDetails = emergencyContactPhone.trim().length > 0;

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

  const handleContinue = () => {
    if (!dateOfBirth || !pregnancyStartDate || isFirstPregnancy === null) {
      Alert.alert('Missing information', 'Please complete all required fields before continuing.');
      return;
    }

    if (showEmergencyContactDetails) {
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

    setPatientProfile({
      dateOfBirth,
      emergencyContact: showEmergencyContactDetails
        ? {
            phoneNumber: emergencyContactPhone.trim(),
            name: emergencyContactName.trim(),
            relationship: emergencyContactRelationship!,
          }
        : null,
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
      bloodGroup,
      allergies: allergies.trim(),
      medicalConditions: selectedConditions,
      otherConditionDetails: otherConditionDetails.trim(),
      riskStatus: getRiskStatusFromConditions(selectedConditions),
    });

    router.replace('/patient-dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={() => router.replace('/patient-sign-up')}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: spacing.scrollPaddingTop,
              paddingBottom: spacing.scrollPaddingBottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Pregnancy Profile Setup</Text>
            <Text style={styles.subtitle}>Help us personalize your pregnancy journey.</Text>
          </View>

          <View
            style={[
              styles.form,
              { marginTop: spacing.headerToForm, gap: spacing.fieldGap },
            ]}>
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

            <BloodGroupSelector
              selectedBloodGroup={bloodGroup}
              onSelect={setBloodGroup}
              label="Blood Group"
            />

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
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton label="Continue" onPress={handleContinue} />
          </View>
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
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  form: {},
  allergiesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 24,
  },
});
