export type Clinic = {
  id: string;
  name: string;
  code: string;
};

export const MOCK_CLINICS: Clinic[] = [
  { id: '1', name: 'Korle Bu Teaching Hospital', code: 'KBTH-001' },
  { id: '2', name: 'Ridge Hospital', code: 'RH-002' },
  { id: '3', name: 'Tamale Teaching Hospital', code: 'TTH-003' },
  { id: '4', name: 'Komfo Anokye Teaching Hospital', code: 'KATH-004' },
  { id: '5', name: 'Cape Coast Teaching Hospital', code: 'CCTH-005' },
  { id: '6', name: 'Greater Accra Regional Hospital', code: 'GARH-006' },
];
