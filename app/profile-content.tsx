import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';
import { PRIVACY_AGREEMENT_TERMS } from '@/constants/privacy-terms';

const CONTENT: Record<
  string,
  { title: string; paragraphs: string[] }
> = {
  privacy: {
    title: 'Privacy Policy',
    paragraphs: PRIVACY_AGREEMENT_TERMS,
  },
  terms: {
    title: 'Terms & Conditions',
    paragraphs: PRIVACY_AGREEMENT_TERMS,
  },
  faqs: {
    title: 'FAQs',
    paragraphs: [
      'How do I add an antenatal appointment?',
      'Go to the Appointments tab and tap Add Appointment. Enter the date and time given by your clinic.',
      '',
      'Can I change my registered clinic?',
      'Use Request Clinic Transfer on your Profile screen. Your clinic will review the request.',
      '',
      'How are risk alerts determined?',
      'Risk alerts are based on your pregnancy profile and medical history. Always follow your clinic’s advice for medical decisions.',
    ],
  },
  support: {
    title: 'Contact Support',
    paragraphs: [
      'Email: support@maternalert.com',
      'Phone: +233 30 000 0000',
      'Hours: Monday – Friday, 8:00 AM – 5:00 PM GMT',
      '',
      'For urgent medical concerns, contact your clinic or emergency services immediately.',
    ],
  },
  about: {
    title: 'About MaternAlert',
    paragraphs: [
      'MaternAlert supports expectant mothers with pregnancy tracking, antenatal appointment reminders, education, and risk alerts.',
      '',
      'The app is designed to complement care from licensed health facilities and does not replace professional medical advice.',
      '',
      'Version 1.0.0',
    ],
  },
};

export default function ProfileContentScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const content = CONTENT[section ?? ''] ?? CONTENT.about;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{content.title}</Text>
        <View style={styles.card}>
          {content.paragraphs.map((paragraph, index) => (
            <Text
              key={`${paragraph}-${index}`}
              style={paragraph ? styles.paragraph : styles.spacer}>
              {paragraph}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.background,
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
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BrandColors.border,
    gap: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: BrandColors.text,
  },
  spacer: {
    height: 4,
  },
});
