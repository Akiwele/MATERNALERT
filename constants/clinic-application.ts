/**
 * Clinic application form URL (MATERNALERT-ADMIN).
 *
 * When running the admin portal locally with Vite (`npm run dev`), use the
 * **Network** URL from the terminal — not localhost — so a physical phone on
 * the same Wi‑Fi can reach it, e.g. http://192.168.1.42:5173/apply
 *
 * Update when your computer's IP changes:
 * - Set EXPO_PUBLIC_CLINIC_APPLICATION_URL in `.env`, or
 * - Change the fallback below to match Vite's Network URL.
 */
export const CLINIC_APPLICATION_URL =
  process.env.EXPO_PUBLIC_CLINIC_APPLICATION_URL ?? 'http://172.20.10.5:5174/apply';
