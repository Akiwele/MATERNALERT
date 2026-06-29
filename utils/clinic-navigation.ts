import type { Href, Router } from 'expo-router';

export const CLINIC_PATIENTS_ROUTE = '/clinic-dashboard/patients' as Href;

export function getClinicPatientDetailsHref(patientId: string): Href {
  return `/clinic-dashboard/patient/${encodeURIComponent(patientId)}` as Href;
}

export function normalizeRouteParam(
  value: string | string[] | undefined,
): string | undefined {
  if (typeof value === 'string' && value.length > 0) {
    return decodeURIComponent(value);
  }

  if (Array.isArray(value) && value.length > 0 && value[0].length > 0) {
    return decodeURIComponent(value[0]);
  }

  return undefined;
}

export function navigateBackFromClinicPatientDetails(router: Router): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(CLINIC_PATIENTS_ROUTE);
}
