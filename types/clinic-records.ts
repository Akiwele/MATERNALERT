import type { AppointmentType } from '@/constants/appointment-types';

export type RiskLevel = 'Low Risk' | 'High Risk';

export type ClinicAppointmentStatus =
  | 'scheduled'
  | 'attended'
  | 'missed'
  | 'reschedule_requested'
  | 'rescheduled';

export type ClinicAppointment = {
  id: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  date: Date;
  time: Date;
  visitType: AppointmentType;
  status: ClinicAppointmentStatus;
  notes?: string;
};

export type ClinicVisit = {
  id: string;
  patientId: string;
  visitDate: Date;
  systolic?: number;
  diastolic?: number;
  weightKg?: number;
  symptoms: string;
  diagnosis: string;
  medication: string;
  nextAppointmentDate?: Date;
  notes: string;
};

export type ClinicActivityType =
  | 'visit_recorded'
  | 'appointment_added'
  | 'high_bp_alert'
  | 'appointment_missed'
  | 'reschedule_requested';

export type ClinicActivity = {
  id: string;
  type: ClinicActivityType;
  message: string;
  createdAt: Date;
};

export type HighRiskAlert = {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
};

export type ClinicEmergencyContact = {
  name: string;
  phoneNumber: string;
  relationship: string;
};

export type ClinicPatientRecord = {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  ancBookNumber?: string;
  registeredClinicName: string;
  lmpDate: Date;
  currentWeek: number;
  riskStatus: RiskLevel;
  riskReasons: string[];
  bloodGroup?: string;
  allergies: string;
  medicalConditions: string[];
  emergencyContact: ClinicEmergencyContact | null;
  lastVisitDate?: Date;
  recentBloodPressure?: { systolic: number; diastolic: number; recordedAt: Date };
  recentWeight?: { valueKg: number; recordedAt: Date };
  recentSymptoms?: string;
  consentGrantedClinicNames: string[];
  visits: ClinicVisit[];
};

export type ClinicDashboardStats = {
  todaysAppointments: number;
  registeredPatients: number;
  highRiskPregnancies: number;
  missedAppointments: number;
};

export type RecordVisitInput = {
  patientId: string;
  visitDate: Date;
  systolic?: number;
  diastolic?: number;
  weightKg?: number;
  symptoms: string;
  diagnosis: string;
  medication: string;
  nextAppointmentDate?: Date;
  notes: string;
};
