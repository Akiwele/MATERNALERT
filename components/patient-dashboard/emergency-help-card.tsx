import { ChevronRight, Siren, UserRound, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { EmergencyContact } from '@/stores/patient-profile';
import {
  sendEmergencyAlert,
  startEmergencyHelpCall,
  startPhoneCall,
} from '@/utils/phone-call';

type EmergencyHelpCardProps = {
  contact: EmergencyContact | null | undefined;
  patientName: string;
};

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'alert' | 'outline';
  disabled?: boolean;
  accessibilityLabel: string;
};

function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
}: ActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'primary' && styles.actionButtonPrimary,
        variant === 'alert' && styles.actionButtonAlert,
        variant === 'outline' && styles.actionButtonOutline,
        disabled && styles.actionButtonDisabled,
        pressed && !disabled && styles.actionButtonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}>
      <Text
        style={[
          styles.actionButtonText,
          variant === 'outline' && styles.actionButtonTextOutline,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

type EmergencyHelpSheetProps = {
  visible: boolean;
  contact: EmergencyContact | null | undefined;
  patientName: string;
  onClose: () => void;
};

function EmergencyHelpSheet({ visible, contact, patientName, onClose }: EmergencyHelpSheetProps) {
  const hasContact =
    Boolean(contact?.name?.trim()) &&
    Boolean(contact?.relationship) &&
    Boolean(contact?.phoneNumber?.trim());

  const handleCallContact = () => {
    if (!hasContact) {
      Alert.alert(
        'No emergency contact',
        'Add an emergency contact in Profile > Emergency Contacts before calling.',
      );
      return;
    }

    void startPhoneCall(contact!.phoneNumber);
  };

  const handleSendAlert = () => {
    if (!hasContact) {
      Alert.alert(
        'No emergency contact',
        'Add an emergency contact in Profile > Emergency Contacts before sending an alert.',
      );
      return;
    }

    Alert.alert(
      'Send emergency alert?',
      `This will open your messaging app to alert ${contact!.name}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => {
            void sendEmergencyAlert(contact!.phoneNumber, patientName);
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent={Platform.OS === 'android'}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close emergency help" />

        <SafeAreaView edges={['bottom']} style={styles.sheetSafeArea}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Emergency Help</Text>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                accessibilityRole="button"
                accessibilityLabel="Close">
                <X size={20} color={BrandColors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}>
              {hasContact ? (
                <View style={styles.contactCard}>
                  <View style={styles.contactRow}>
                    <View style={styles.contactIconWrap}>
                      <UserRound size={18} color={BrandColors.primaryDark} />
                    </View>
                    <View style={styles.contactCopy}>
                      <Text style={styles.contactLabel}>Primary emergency contact</Text>
                      <Text style={styles.contactName}>{contact!.name}</Text>
                      <Text style={styles.contactMeta}>{contact!.relationship}</Text>
                      <Text style={styles.phoneNumber}>{contact!.phoneNumber}</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  No emergency contact saved yet. Add one in Profile {'>'} Emergency Contacts to
                  enable call and alert actions.
                </Text>
              )}

              <View style={styles.actions}>
                <ActionButton
                  label="Call Contact"
                  onPress={handleCallContact}
                  disabled={!hasContact}
                  accessibilityLabel="Call emergency contact"
                />
                <ActionButton
                  label="Send Emergency Alert"
                  onPress={handleSendAlert}
                  variant="alert"
                  disabled={!hasContact}
                  accessibilityLabel="Send emergency alert to saved contact"
                />
                <ActionButton
                  label="Call Ambulance"
                  onPress={() => {
                    void startEmergencyHelpCall();
                  }}
                  variant="outline"
                  accessibilityLabel="Call ambulance or emergency services"
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export function EmergencyHelpCard({ contact, patientName }: EmergencyHelpCardProps) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.compactCard, pressed && styles.compactCardPressed]}
        onPress={() => setIsSheetVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Open emergency help">
        <View style={styles.iconWrap}>
          <Siren size={22} color={BrandColors.primary} />
        </View>
        <View style={styles.compactCopy}>
          <Text style={styles.compactTitle}>Emergency Help</Text>
          <Text style={styles.compactSubtitle}>
            Call your emergency contact or send an alert quickly
          </Text>
        </View>
        <ChevronRight size={18} color={BrandColors.textSecondary} />
      </Pressable>

      <EmergencyHelpSheet
        visible={isSheetVisible}
        contact={contact}
        patientName={patientName}
        onClose={() => setIsSheetVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    backgroundColor: BrandColors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  compactCardPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  compactCopy: {
    flex: 1,
    gap: 4,
  },
  compactTitle: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.text,
    lineHeight: 20,
  },
  compactSubtitle: {
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    color: BrandColors.textSecondary,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheetSafeArea: {
    maxHeight: '88%',
  },
  sheet: {
    backgroundColor: BrandColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: BrandColors.border,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sheetTitle: {
    fontSize: PatientDashboardTypography.cardTitleLarge,
    fontWeight: '700',
    color: BrandColors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.background,
  },
  closeButtonPressed: {
    opacity: 0.8,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  contactCard: {
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    padding: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BrandColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCopy: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: PatientDashboardTypography.captionSmall,
    fontWeight: '600',
    color: BrandColors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  contactName: {
    fontSize: PatientDashboardTypography.body,
    fontWeight: '700',
    color: BrandColors.text,
  },
  contactMeta: {
    fontSize: PatientDashboardTypography.caption,
    color: BrandColors.textSecondary,
    lineHeight: 18,
  },
  phoneNumber: {
    fontSize: PatientDashboardTypography.bodySmall,
    fontWeight: '600',
    color: BrandColors.text,
    marginTop: 2,
  },
  emptyText: {
    fontSize: PatientDashboardTypography.bodySmall,
    lineHeight: 22,
    color: BrandColors.textSecondary,
  },
  actions: {
    gap: 10,
  },
  actionButton: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: BrandColors.primary,
  },
  actionButtonAlert: {
    backgroundColor: '#DC2626',
  },
  actionButtonOutline: {
    backgroundColor: BrandColors.white,
    borderWidth: 1.5,
    borderColor: BrandColors.primary,
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  actionButtonPressed: {
    opacity: 0.9,
  },
  actionButtonText: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '700',
    color: BrandColors.white,
    textAlign: 'center',
  },
  actionButtonTextOutline: {
    color: BrandColors.primaryDark,
  },
});
