const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GHANA_MOBILE_PREFIXES = [
  '020',
  '023',
  '024',
  '025',
  '026',
  '027',
  '028',
  '050',
  '054',
  '055',
  '056',
  '057',
  '059',
];

const NAME_WORD_REGEX = /^[A-Za-z]+$/;

export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }

  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'Email is required.';
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address.';
  }

  return undefined;
}

export function validateSignUpEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'Email is required.';
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Enter a valid email address.';
  }

  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return undefined;
}

export function validateFullName(name: string): string | undefined {
  const trimmed = name.trim();

  if (!trimmed) {
    return 'Full name is required.';
  }

  const words = trimmed.split(/\s+/).filter(Boolean);

  if (words.length < 2) {
    return 'Enter your first and last name.';
  }

  if (!words.every((word) => NAME_WORD_REGEX.test(word))) {
    return 'Enter your first and last name.';
  }

  return undefined;
}

export function validateGhanaPhoneNumber(phone: string): string | undefined {
  if (!phone.trim()) {
    return 'Phone number is required.';
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.length !== 10) {
    return 'Enter a valid phone number.';
  }

  const prefix = digits.slice(0, 3);
  if (!GHANA_MOBILE_PREFIXES.includes(prefix)) {
    return 'Enter a valid phone number.';
  }

  return undefined;
}

export function validateSignUpPassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return 'Password must contain at least one uppercase letter and one number.';
  }

  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return 'Confirm password is required.';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return undefined;
}

export function validateClinicSelection<T>(clinic: T | null): string | undefined {
  if (!clinic) {
    return 'Please select a clinic.';
  }

  return undefined;
}
