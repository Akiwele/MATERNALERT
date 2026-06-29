import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storage-keys';
import type { AccountType } from '@/types/app-navigation';

function isAccountType(value: string | null): value is AccountType {
  return value === 'patient' || value === 'clinic';
}

export async function getSavedAccountType(): Promise<AccountType | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNT_TYPE);

  if (!isAccountType(value)) {
    return null;
  }

  return value;
}

export async function saveAccountType(accountType: AccountType): Promise<void> {
  const existing = await getSavedAccountType();

  if (existing) {
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNT_TYPE, accountType);
}

export async function clearSavedAccountType(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.ACCOUNT_TYPE);
}
