import type { CareNetworkPatient } from '@/types/clinic-patient';

export const MOCK_CARE_NETWORK_PATIENTS: CareNetworkPatient[] = [
  {
    id: 'rec-stacy-mensah',
    fullName: 'Stacy Mensah',
    phoneNumber: '0244123456',
    emailAddress: 'stacy.mensah@email.com',
    registeredClinicName: 'Korle Bu Teaching Hospital',
    currentWeek: 28,
    riskStatus: 'Low Risk',
    consentGrantedClinicNames: ['Korle Bu Teaching Hospital'],
  },
  {
    id: 'rec-ama-boateng',
    fullName: 'Ama Boateng',
    phoneNumber: '0551987654',
    emailAddress: 'ama.boateng@email.com',
    registeredClinicName: 'Ridge Hospital',
    currentWeek: 32,
    riskStatus: 'High Risk',
    consentGrantedClinicNames: ['Ridge Hospital'],
  },
  {
    id: 'rec-abena-kwame',
    fullName: 'Abena Kwame',
    phoneNumber: '0203344556',
    emailAddress: 'abena.kwame@email.com',
    registeredClinicName: 'Tamale Teaching Hospital',
    currentWeek: 20,
    riskStatus: 'Low Risk',
    consentGrantedClinicNames: ['Tamale Teaching Hospital'],
  },
  {
    id: 'rec-evelyn-adjei',
    fullName: 'Evelyn Adjei',
    phoneNumber: '0277788990',
    emailAddress: 'evelyn.adjei@email.com',
    registeredClinicName: 'Komfo Anokye Teaching Hospital',
    currentWeek: 24,
    riskStatus: 'Low Risk',
    consentGrantedClinicNames: [],
  },
];
