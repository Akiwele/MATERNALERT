export type AccountType = 'patient' | 'clinic';

export type AuthSession = {
  accountType: AccountType;
  isAuthenticated: true;
};

export const ACCOUNT_TYPE_LOGIN_ROUTES: Record<AccountType, '/patient-login' | '/clinic-login'> = {
  patient: '/patient-login',
  clinic: '/clinic-login',
};

export const ACCOUNT_TYPE_DASHBOARD_ROUTES: Record<
  AccountType,
  '/patient-dashboard' | '/clinic-dashboard'
> = {
  patient: '/patient-dashboard',
  clinic: '/clinic-dashboard',
};
