import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { clearSavedAccountType } from '@/utils/account-type-storage';

// Temporary development reset button. Remove before production.
export function DevAccountTypeResetLink() {
  const router = useRouter();

  const handlePress = async () => {
    await clearSavedAccountType();
    router.replace('/choose-account-type');
  };

  return (
    <Text style={styles.link} onPress={handlePress}>
      Reset Account Type
    </Text>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 24,
    fontSize: 12,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
});
