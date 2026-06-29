import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import type { AccountType, AuthSession } from '@/types/app-navigation';

function parseAuthSession(value: string | null): AuthSession | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as AuthSession;

    if (
      parsed?.isAuthenticated === true &&
      (parsed.accountType === 'patient' || parsed.accountType === 'clinic')
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
  return parseAuthSession(value);
}

export async function setAuthSession(accountType: AccountType): Promise<void> {
  const session: AuthSession = {
    accountType,
    isAuthenticated: true,
  };

  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
}
