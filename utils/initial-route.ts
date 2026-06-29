import type { Href } from 'expo-router';

import {
  ACCOUNT_TYPE_DASHBOARD_ROUTES,
  ACCOUNT_TYPE_LOGIN_ROUTES,
} from '@/types/app-navigation';
import { getSavedAccountType } from '@/utils/account-type-storage';
import { getAuthSession } from '@/utils/auth-session-storage';

export async function resolveInitialRoute(): Promise<Href> {
  const authSession = await getAuthSession();

  if (authSession?.isAuthenticated) {
    return ACCOUNT_TYPE_DASHBOARD_ROUTES[authSession.accountType];
  }

  const accountType = await getSavedAccountType();

  if (accountType) {
    return ACCOUNT_TYPE_LOGIN_ROUTES[accountType];
  }

  return '/choose-account-type';
}
