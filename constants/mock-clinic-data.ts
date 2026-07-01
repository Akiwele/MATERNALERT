import type { ClinicAppointment, ClinicActivity, ClinicPatientRecord } from '@/types/clinic-records';

const CLINIC_NAME = 'Korle Bu Teaching Hospital';

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date;
}

function atTime(baseDate: Date, hours: number, minutes: number): Date {
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function lmpWeeksAgo(weeks: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - weeks * 7);
  date.setHours(0, 0, 0, 0);
  return date;
}

export const MOCK_CLINIC_PATIENTS: ClinicPatientRecord[] = [
  {
    id: 'rec-stacy-mensah',
    fullName: 'Stacy Mensah',
    phoneNumber: '0244123456',
    emailAddress: 'stacy.mensah@email.com',
    ancBookNumber: 'ANC-2026-00482',
    registeredClinicName: CLINIC_NAME,
    lmpDate: lmpWeeksAgo(28),
    currentWeek: 28,
    riskStatus: 'Low Risk',
    riskReasons: [],
    bloodGroup: 'O+',
    allergies: 'None recorded',
    medicalConditions: ['None'],
    emergencyContact: {
      name: 'Kwame Mensah',
      phoneNumber: '0244987654',
      relationship: 'Spouse',
    },
    lastVisitDate: daysAgo(14),
    recentBloodPressure: { systolic: 118, diastolic: 76, recordedAt: daysAgo(14) },
    recentWeight: { valueKg: 72, recordedAt: daysAgo(14) },
    recentSymptoms: 'Mild back pain',
    consentGrantedClinicNames: [CLINIC_NAME],
    visits: [
      {
        id: 'visit-stacy-1',
        patientId: 'rec-stacy-mensah',
        visitDate: daysAgo(14),
        systolic: 118,
        diastolic: 76,
        weightKg: 72,
        symptoms: 'Mild back pain',
        diagnosis: 'Routine ANC — progressing well',
        medication: 'Folic acid, iron supplements',
        notes: 'Continue routine care.',
      },
    ],
  },
  {
    id: 'rec-ama-boateng',
    fullName: 'Ama Boateng',
    phoneNumber: '0551987654',
    emailAddress: 'ama.boateng@email.com',
    ancBookNumber: 'ANC-2025-11204',
    registeredClinicName: 'Ridge Hospital',
    lmpDate: lmpWeeksAgo(32),
    currentWeek: 32,
    riskStatus: 'High Risk',
    riskReasons: ['Hypertension', 'High BP'],
    bloodGroup: 'A+',
    allergies: 'Penicillin',
    medicalConditions: ['Hypertension', 'Anaemia'],
    emergencyContact: {
      name: 'Efua Boateng',
      phoneNumber: '0551122334',
      relationship: 'Sister',
    },
    lastVisitDate: daysAgo(7),
    recentBloodPressure: { systolic: 148, diastolic: 94, recordedAt: daysAgo(7) },
    recentWeight: { valueKg: 78, recordedAt: daysAgo(7) },
    recentSymptoms: 'Headaches, swollen feet',
    consentGrantedClinicNames: [CLINIC_NAME, 'Ridge Hospital'],
    visits: [
      {
        id: 'visit-ama-1',
        patientId: 'rec-ama-boateng',
        visitDate: daysAgo(7),
        systolic: 148,
        diastolic: 94,
        weightKg: 78,
        symptoms: 'Headaches, swollen feet',
        diagnosis: 'Gestational hypertension — monitor closely',
        medication: 'Methyldopa prescribed',
        notes: 'Weekly review required.',
      },
    ],
  },
  {
    id: 'rec-abena-kwame',
    fullName: 'Abena Kwame',
    phoneNumber: '0203344556',
    emailAddress: 'abena.kwame@email.com',
    registeredClinicName: 'Tamale Teaching Hospital',
    lmpDate: lmpWeeksAgo(20),
    currentWeek: 20,
    riskStatus: 'Low Risk',
    riskReasons: [],
    bloodGroup: 'B+',
    allergies: 'None recorded',
    medicalConditions: ['None'],
    emergencyContact: {
      name: 'Akosua Kwame',
      phoneNumber: '0209988776',
      relationship: 'Mother',
    },
    lastVisitDate: daysAgo(28),
    recentBloodPressure: { systolic: 112, diastolic: 72, recordedAt: daysAgo(28) },
    recentWeight: { valueKg: 65, recordedAt: daysAgo(28) },
    recentSymptoms: 'None reported',
    consentGrantedClinicNames: [CLINIC_NAME],
    visits: [
      {
        id: 'visit-abena-1',
        patientId: 'rec-abena-kwame',
        visitDate: daysAgo(28),
        systolic: 112,
        diastolic: 72,
        weightKg: 65,
        symptoms: 'None reported',
        diagnosis: 'Routine ANC visit',
        medication: 'Folic acid',
        notes: 'Next visit in 4 weeks.',
      },
    ],
  },
  {
    id: 'rec-jane-doe',
    fullName: 'Jane Doe',
    phoneNumber: '0277654321',
    emailAddress: 'jane.doe@email.com',
    ancBookNumber: 'ANC-2026-00331',
    registeredClinicName: CLINIC_NAME,
    lmpDate: lmpWeeksAgo(24),
    currentWeek: 24,
    riskStatus: 'High Risk',
    riskReasons: ['High BP', 'Missed 2 consecutive ANC appointments.'],
    bloodGroup: 'AB+',
    allergies: 'None recorded',
    medicalConditions: ['Hypertension'],
    emergencyContact: {
      name: 'John Doe',
      phoneNumber: '0277111222',
      relationship: 'Spouse',
    },
    lastVisitDate: daysAgo(42),
    recentBloodPressure: { systolic: 152, diastolic: 98, recordedAt: daysAgo(42) },
    recentWeight: { valueKg: 81, recordedAt: daysAgo(42) },
    recentSymptoms: 'Dizziness, elevated BP',
    consentGrantedClinicNames: [CLINIC_NAME],
    visits: [],
  },
  {
    id: 'rec-evelyn-adjei',
    fullName: 'Evelyn Adjei',
    phoneNumber: '0277788990',
    emailAddress: 'evelyn.adjei@email.com',
    ancBookNumber: 'ANC-2026-00815',
    registeredClinicName: 'Komfo Anokye Teaching Hospital',
    lmpDate: lmpWeeksAgo(24),
    currentWeek: 24,
    riskStatus: 'Low Risk',
    riskReasons: [],
    bloodGroup: 'O-',
    allergies: 'None recorded',
    medicalConditions: ['None'],
    emergencyContact: null,
    lastVisitDate: daysAgo(21),
    recentBloodPressure: { systolic: 120, diastolic: 78, recordedAt: daysAgo(21) },
    recentWeight: { valueKg: 70, recordedAt: daysAgo(21) },
    recentSymptoms: 'Mild nausea',
    consentGrantedClinicNames: [CLINIC_NAME],
    visits: [],
  },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

export const MOCK_CLINIC_APPOINTMENTS: ClinicAppointment[] = [
  {
    id: 'appt-1',
    patientId: 'rec-stacy-mensah',
    patientName: 'Stacy Mensah',
    phoneNumber: '0244123456',
    date: today,
    time: atTime(today, 9, 0),
    visitType: 'Routine ANC Visit',
    status: 'scheduled',
    notes: 'Bring your ANC book and previous lab results.',
  },
  {
    id: 'appt-2',
    patientId: 'rec-ama-boateng',
    patientName: 'Ama Boateng',
    phoneNumber: '0551987654',
    date: today,
    time: atTime(today, 10, 30),
    visitType: 'Follow-up Visit',
    status: 'scheduled',
  },
  {
    id: 'appt-3',
    patientId: 'rec-abena-kwame',
    patientName: 'Abena Kwame',
    phoneNumber: '0203344556',
    date: today,
    time: atTime(today, 14, 0),
    visitType: 'Lab Test',
    status: 'scheduled',
  },
  {
    id: 'appt-4',
    patientId: 'rec-jane-doe',
    patientName: 'Jane Doe',
    phoneNumber: '0277654321',
    date: daysFromNow(3),
    time: atTime(daysFromNow(3), 11, 0),
    visitType: 'Emergency Review',
    status: 'scheduled',
  },
  {
    id: 'appt-5',
    patientId: 'rec-evelyn-adjei',
    patientName: 'Evelyn Adjei',
    phoneNumber: '0277788990',
    date: daysFromNow(7),
    time: atTime(daysFromNow(7), 9, 30),
    visitType: 'Ultrasound Scan',
    status: 'scheduled',
  },
  {
    id: 'appt-6',
    patientId: 'rec-jane-doe',
    patientName: 'Jane Doe',
    phoneNumber: '0277654321',
    date: daysAgo(14),
    time: atTime(daysAgo(14), 10, 0),
    visitType: 'Routine ANC Visit',
    status: 'missed',
  },
  {
    id: 'appt-7',
    patientId: 'rec-jane-doe',
    patientName: 'Jane Doe',
    phoneNumber: '0277654321',
    date: daysAgo(28),
    time: atTime(daysAgo(28), 10, 0),
    visitType: 'Routine ANC Visit',
    status: 'missed',
  },
  {
    id: 'appt-8',
    patientId: 'rec-stacy-mensah',
    patientName: 'Stacy Mensah',
    phoneNumber: '0244123456',
    date: daysAgo(14),
    time: atTime(daysAgo(14), 9, 0),
    visitType: 'Routine ANC Visit',
    status: 'attended',
  },
];

export const MOCK_CLINIC_ACTIVITIES: ClinicActivity[] = [
  {
    id: 'activity-1',
    type: 'visit_recorded',
    message: 'Visit recorded for Ama Mensah',
    createdAt: daysAgo(1),
  },
  {
    id: 'activity-2',
    type: 'appointment_added',
    message: 'Next appointment added for Stacy Mensah',
    createdAt: daysAgo(2),
  },
  {
    id: 'activity-3',
    type: 'high_bp_alert',
    message: 'High BP alert generated for Jane Doe',
    createdAt: daysAgo(3),
  },
  {
    id: 'activity-4',
    type: 'appointment_missed',
    message: 'Missed appointment flagged for Jane Doe',
    createdAt: daysAgo(5),
  },
];
