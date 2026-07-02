import { Alert, Linking } from 'react-native';

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[^\d+]/g, '');
}

export async function startPhoneCall(phoneNumber: string): Promise<void> {
  const normalized = normalizePhoneNumber(phoneNumber.trim());

  if (!normalized) {
    Alert.alert('No phone number', 'A valid phone number is required to place a call.');
    return;
  }

  const url = `tel:${normalized}`;

  try {
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert('Unable to call', 'Phone calls are not supported on this device.');
      return;
    }

    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to call', 'Could not start a phone call on this device.');
  }
}

export async function startEmergencyHelpCall(): Promise<void> {
  await startPhoneCall('112');
}

export async function sendEmergencyAlert(
  phoneNumber: string,
  patientName: string,
): Promise<void> {
  const normalized = normalizePhoneNumber(phoneNumber.trim());

  if (!normalized) {
    Alert.alert('No emergency contact', 'Add an emergency contact in Profile before sending an alert.');
    return;
  }

  const message = encodeURIComponent(
    `Emergency alert from ${patientName.trim() || 'a MaternAlert user'}: I need urgent help. Please contact me or call emergency services.`,
  );
  const url = `sms:${normalized}?body=${message}`;

  try {
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert(
        'Unable to send alert',
        'Text messaging is not supported on this device. Try calling your emergency contact instead.',
      );
      return;
    }

    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to send alert', 'Could not open your messaging app on this device.');
  }
}
