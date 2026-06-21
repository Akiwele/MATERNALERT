import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { BrandColors } from '@/constants/brand';

type AuthTextFieldProps = TextInputProps & {
  label: string;
  isPassword?: boolean;
  error?: string;
};

export function AuthTextField({
  label,
  isPassword = false,
  error,
  ...inputProps
}: AuthTextFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, isPassword && styles.passwordInput]}
          placeholderTextColor={BrandColors.textSecondary}
          secureTextEntry={isPassword && !isVisible}
          autoCapitalize={isPassword ? 'none' : inputProps.autoCapitalize}
          autoCorrect={false}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            style={styles.eyeButton}
            onPress={() => setIsVisible((current) => !current)}
            hitSlop={8}>
            {isVisible ? (
              <EyeOff size={20} color={BrandColors.textSecondary} />
            ) : (
              <Eye size={20} color={BrandColors.textSecondary} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: BrandColors.white,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: BrandColors.text,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  error: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
});
