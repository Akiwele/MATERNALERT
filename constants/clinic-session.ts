/** Mock logged-in clinic for the mobile clinic dashboard. */
export const MOCK_CLINIC_SESSION = {
  name: 'Korle Bu Teaching Hospital',
  hefraLicenceNumber: 'HFR-GH-2024-00142',
  officialEmail: 'anc@korlebu.gov.gh',
  phoneNumber: '030 266 4701',
  region: 'Greater Accra',
  district: 'Accra Metropolitan',
  accountStatus: 'Approved / Active' as const,
  registrationNumber: 'GHS-001',
} as const;
