import { useRouter } from 'expo-router';
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

import { AuthTextField } from '@/components/auth-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { RelationshipSelector } from '@/components/relationship-selector';
import { BrandColors } from '@/constants/brand';
import { EmergencyContactRelationship } from '@/constants/emergency-contact-relationships';
import { getPatientProfile, updatePatientProfile } from '@/stores/patient-profile';

export default function EditEmergencyContactScreen() {
  const router = useRouter();
  const profile = getPatientProfile();
  const existing = profile?.emergencyContact;

  const [emergencyContactPhone, setEmergencyContactPhone] = useState(existing?.phoneNumber ?? '');
  const [emergencyContactName, setEmergencyContactName] = useState(existing?.name ?? '');
  const [emergencyContactRelationship, setEmergencyContactRelationship] =
    useState<EmergencyContactRelationship | null>(existing?.relationship ?? null);

  const handleSave = () => {
    if (!emergencyContactPhone.trim()) {
      Alert.alert('Missing information', 'Please enter an emergency contact phone number.');
      return;
    }

    if (!emergencyContactName.trim() || !emergencyContactRelationship) {
      Alert.alert(
        'Missing information',
        'Please provide the emergency contact name and relationship.',
      );
      return;
    }

    updatePatientProfile({
      emergencyContact: {
        phoneNumber: emergencyContactPhone.trim(),
        name: emergencyContactName.trim(),
        relationship: emergencyContactRelationship,
      },
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Edit Emergency Contact</Text>
          <Text style={styles.subtitle}>Keep your emergency contact details up to date.</Text>

          <View style={styles.form}>
            <AuthTextField
              label="Phone Number"
              value={emergencyContactPhone}
              onChangeText={setEmergencyContactPhone}
              keyboardType="phone-pad"
            />
            <AuthTextField
              label="Contact Name"
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              autoCapitalize="words"
            />
            <RelationshipSelector
              selectedRelationship={emergencyContactRelationship}
              onSelect={setEmergencyContactRelationship}
            />
            <PrimaryButton label="Save Changes" onPress={handleSave} />
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
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.text,
  },
  subtitle: {
    fontSize: 15,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  form: {
    gap: 18,
    marginTop: 8,
  },
});
