import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { MOCK_CLINIC_SESSION } from '@/constants/clinic-session';
import { MOCK_CLINIC_ACTIVITIES, MOCK_CLINIC_PATIENTS } from '@/constants/mock-clinic-data';
import {
  getAncAppointments,
  subscribeAncAppointments,
  updateAncAppointments,
} from '@/stores/anc-appointments-store';
import type {
  ClinicActivity,
  ClinicAppointment,
  ClinicDashboardStats,
  ClinicPatientRecord,
  HighRiskAlert,
  RecordVisitInput,
  RiskLevel,
} from '@/types/clinic-records';
import {
  deriveRiskStatusFromReasons,
  getMissedAncRiskReasons,
} from '@/utils/anc-risk-rules';
import { clinicHasPatientAccess } from '@/utils/clinic-access';
import {
  isFutureDay,
  isHighBloodPressure,
  isToday,
} from '@/utils/clinic-date-utils';
import { searchCareNetworkPatients } from '@/utils/clinic-patient-search';
import { calculatePregnancyMetrics } from '@/utils/pregnancy-calculations';

type ClinicDataContextValue = {
  clinicName: string;
  patients: ClinicPatientRecord[];
  appointments: ClinicAppointment[];
  activities: ClinicActivity[];
  stats: ClinicDashboardStats;
  todaysAppointments: ClinicAppointment[];
  upcomingAppointments: ClinicAppointment[];
  missedAppointments: ClinicAppointment[];
  rescheduleRequestedAppointments: ClinicAppointment[];
  highRiskAlerts: HighRiskAlert[];
  getPatientById: (patientId: string) => ClinicPatientRecord | undefined;
  getAccessiblePatientById: (patientId: string) => ClinicPatientRecord | undefined;
  getAccessiblePatients: () => ClinicPatientRecord[];
  searchPatients: (query: string) => ClinicPatientRecord[];
  getPatientAppointments: (patientId: string) => ClinicAppointment[];
  recordVisit: (input: RecordVisitInput) => void;
  addAppointment: (
    patientId: string,
    date: Date,
    time: Date,
    visitType: ClinicAppointment['visitType'],
    notes?: string,
  ) => void;
  markAppointmentAttended: (appointmentId: string) => void;
  markAppointmentMissed: (appointmentId: string) => void;
  rescheduleAppointment: (appointmentId: string, date: Date, time: Date) => void;
};

const ClinicDataContext = createContext<ClinicDataContextValue | null>(null);

function createActivityId(): string {
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createVisitId(): string {
  return `visit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createAppointmentId(): string {
  return `appt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function useAncAppointmentsSnapshot(): ClinicAppointment[] {
  return useSyncExternalStore(subscribeAncAppointments, getAncAppointments, getAncAppointments);
}

function syncPatientMissedAncRisk(
  patients: ClinicPatientRecord[],
  patientId: string,
  patientAppointments: ClinicAppointment[],
): ClinicPatientRecord[] {
  return patients.map((patient) => {
    if (patient.id !== patientId) {
      return patient;
    }

    const riskReasons = getMissedAncRiskReasons(patientAppointments, patient.riskReasons);

    return {
      ...patient,
      riskReasons,
      riskStatus: deriveRiskStatusFromReasons(riskReasons),
    };
  });
}

export function ClinicDataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<ClinicPatientRecord[]>(MOCK_CLINIC_PATIENTS);
  const appointments = useAncAppointmentsSnapshot();
  const [activities, setActivities] = useState<ClinicActivity[]>(MOCK_CLINIC_ACTIVITIES);

  const clinicName = MOCK_CLINIC_SESSION.name;

  const accessiblePatients = useMemo(
    () => patients.filter((patient) => clinicHasPatientAccess(patient.consentGrantedClinicNames)),
    [patients],
  );

  const getPatientById = useCallback(
    (patientId: string) => patients.find((patient) => patient.id === patientId),
    [patients],
  );

  const getAccessiblePatientById = useCallback(
    (patientId: string) => accessiblePatients.find((patient) => patient.id === patientId),
    [accessiblePatients],
  );

  const getAccessiblePatients = useCallback(() => accessiblePatients, [accessiblePatients]);

  const searchPatients = useCallback(
    (query: string) => {
      const searchable = accessiblePatients.map((patient) => ({
        id: patient.id,
        fullName: patient.fullName,
        phoneNumber: patient.phoneNumber,
        emailAddress: patient.emailAddress,
        registeredClinicName: patient.registeredClinicName,
        currentWeek: patient.currentWeek,
        riskStatus: patient.riskStatus,
        consentGrantedClinicNames: patient.consentGrantedClinicNames,
      }));

      const matchedIds = new Set(
        searchCareNetworkPatients(searchable, query).map((patient) => patient.id),
      );

      return accessiblePatients.filter((patient) => matchedIds.has(patient.id));
    },
    [accessiblePatients],
  );

  const getPatientAppointments = useCallback(
    (patientId: string) =>
      appointments
        .filter((appointment) => appointment.patientId === patientId)
        .sort((left, right) => right.date.getTime() - left.date.getTime()),
    [appointments],
  );

  const todaysAppointments = useMemo(
    () =>
      appointments
        .filter(
          (appointment) =>
            isToday(appointment.date) &&
            (appointment.status === 'scheduled' || appointment.status === 'reschedule_requested'),
        )
        .sort((left, right) => left.time.getTime() - right.time.getTime()),
    [appointments],
  );

  const upcomingAppointments = useMemo(
    () =>
      appointments
        .filter(
          (appointment) =>
            (appointment.status === 'scheduled' || appointment.status === 'rescheduled') &&
            isFutureDay(appointment.date),
        )
        .sort((left, right) => left.date.getTime() - right.date.getTime()),
    [appointments],
  );

  const missedAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.status === 'missed')
        .sort((left, right) => right.date.getTime() - left.date.getTime()),
    [appointments],
  );

  const rescheduleRequestedAppointments = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.status === 'reschedule_requested')
        .sort((left, right) => left.date.getTime() - right.date.getTime()),
    [appointments],
  );

  const highRiskAlerts = useMemo<HighRiskAlert[]>(
    () =>
      accessiblePatients
        .filter((patient) => patient.riskStatus === 'High Risk')
        .flatMap((patient) =>
          (patient.riskReasons.length > 0 ? patient.riskReasons : ['High-risk pregnancy']).map(
            (reason, index) => ({
              id: `${patient.id}-risk-${index}`,
              patientId: patient.id,
              patientName: patient.fullName,
              reason,
            }),
          ),
        ),
    [accessiblePatients],
  );

  const stats = useMemo<ClinicDashboardStats>(
    () => ({
      todaysAppointments: todaysAppointments.length,
      registeredPatients: accessiblePatients.length,
      highRiskPregnancies: accessiblePatients.filter((patient) => patient.riskStatus === 'High Risk')
        .length,
      missedAppointments: missedAppointments.length,
    }),
    [accessiblePatients, missedAppointments.length, todaysAppointments.length],
  );

  const prependActivity = useCallback((activity: Omit<ClinicActivity, 'id' | 'createdAt'>) => {
    setActivities((current) => [
      {
        id: createActivityId(),
        createdAt: new Date(),
        ...activity,
      },
      ...current,
    ]);
  }, []);

  const recordVisit = useCallback(
    (input: RecordVisitInput) => {
      const patient = patients.find((entry) => entry.id === input.patientId);

      if (!patient) {
        return;
      }

      const visit = {
        id: createVisitId(),
        patientId: input.patientId,
        visitDate: input.visitDate,
        systolic: input.systolic,
        diastolic: input.diastolic,
        weightKg: input.weightKg,
        symptoms: input.symptoms,
        diagnosis: input.diagnosis,
        medication: input.medication,
        nextAppointmentDate: input.nextAppointmentDate,
        notes: input.notes,
      };

      const metrics = calculatePregnancyMetrics(patient.lmpDate);
      const highBp = isHighBloodPressure(input.systolic, input.diastolic);
      const nextRiskReasons = [...patient.riskReasons];

      if (highBp && !nextRiskReasons.includes('High BP')) {
        nextRiskReasons.push('High BP');
      }

      const updatedPatient: ClinicPatientRecord = {
        ...patient,
        currentWeek: metrics.weeks,
        lastVisitDate: input.visitDate,
        recentSymptoms: input.symptoms.trim() || patient.recentSymptoms,
        recentBloodPressure:
          input.systolic !== undefined && input.diastolic !== undefined
            ? {
                systolic: input.systolic,
                diastolic: input.diastolic,
                recordedAt: input.visitDate,
              }
            : patient.recentBloodPressure,
        recentWeight:
          input.weightKg !== undefined
            ? { valueKg: input.weightKg, recordedAt: input.visitDate }
            : patient.recentWeight,
        riskReasons: nextRiskReasons,
        riskStatus: deriveRiskStatusFromReasons(nextRiskReasons),
        visits: [visit, ...patient.visits],
      };

      setPatients((current) =>
        current.map((entry) => (entry.id === input.patientId ? updatedPatient : entry)),
      );

      prependActivity({
        type: 'visit_recorded',
        message: `Visit recorded for ${patient.fullName}`,
      });

      if (highBp) {
        prependActivity({
          type: 'high_bp_alert',
          message: `High BP alert generated for ${patient.fullName}`,
        });
      }

      if (input.nextAppointmentDate) {
        const appointmentTime = new Date(input.nextAppointmentDate);
        appointmentTime.setHours(9, 0, 0, 0);

        const newAppointment: ClinicAppointment = {
          id: createAppointmentId(),
          patientId: patient.id,
          patientName: patient.fullName,
          phoneNumber: patient.phoneNumber,
          date: input.nextAppointmentDate,
          time: appointmentTime,
          visitType: 'Routine ANC Visit',
          status: 'scheduled',
        };

        updateAncAppointments((current) => [newAppointment, ...current]);
        prependActivity({
          type: 'appointment_added',
          message: `Next appointment added for ${patient.fullName}`,
        });
      }
    },
    [patients, prependActivity],
  );

  const addAppointment = useCallback(
    (
      patientId: string,
      date: Date,
      time: Date,
      visitType: ClinicAppointment['visitType'],
      notes?: string,
    ) => {
      const patient = patients.find((entry) => entry.id === patientId);

      if (!patient) {
        return;
      }

      const newAppointment: ClinicAppointment = {
        id: createAppointmentId(),
        patientId,
        patientName: patient.fullName,
        phoneNumber: patient.phoneNumber,
        date,
        time,
        visitType,
        status: 'scheduled',
        notes: notes?.trim() || undefined,
      };

      updateAncAppointments((current) => [newAppointment, ...current]);
      prependActivity({
        type: 'appointment_added',
        message: `ANC appointment scheduled for ${patient.fullName}`,
      });
    },
    [patients, prependActivity],
  );

  const markAppointmentAttended = useCallback((appointmentId: string) => {
    updateAncAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: 'attended' } : appointment,
      ),
    );
  }, []);

  const markAppointmentMissed = useCallback(
    (appointmentId: string) => {
      const appointment = appointments.find((entry) => entry.id === appointmentId);

      updateAncAppointments((current) =>
        current.map((entry) =>
          entry.id === appointmentId ? { ...entry, status: 'missed' } : entry,
        ),
      );

      if (appointment) {
        prependActivity({
          type: 'appointment_missed',
          message: `Missed appointment flagged for ${appointment.patientName}`,
        });

        const patientAppointments = appointments
          .map((entry) =>
            entry.id === appointmentId ? { ...entry, status: 'missed' as const } : entry,
          )
          .filter((entry) => entry.patientId === appointment.patientId);

        setPatients((current) =>
          syncPatientMissedAncRisk(current, appointment.patientId, patientAppointments),
        );
      }
    },
    [appointments, prependActivity],
  );

  const rescheduleAppointment = useCallback(
    (appointmentId: string, date: Date, time: Date) => {
      const appointment = appointments.find((entry) => entry.id === appointmentId);

      updateAncAppointments((current) =>
        current.map((entry) =>
          entry.id === appointmentId
            ? { ...entry, date, time, status: 'scheduled' }
            : entry,
        ),
      );

      if (appointment) {
        prependActivity({
          type: 'appointment_added',
          message: `Appointment rescheduled for ${appointment.patientName}`,
        });
      }
    },
    [appointments, prependActivity],
  );

  const value = useMemo<ClinicDataContextValue>(
    () => ({
      clinicName,
      patients,
      appointments,
      activities,
      stats,
      todaysAppointments,
      upcomingAppointments,
      missedAppointments,
      rescheduleRequestedAppointments,
      highRiskAlerts,
      getPatientById,
      getAccessiblePatientById,
      getAccessiblePatients,
      searchPatients,
      getPatientAppointments,
      recordVisit,
      addAppointment,
      markAppointmentAttended,
      markAppointmentMissed,
      rescheduleAppointment,
    }),
    [
      clinicName,
      patients,
      appointments,
      activities,
      stats,
      todaysAppointments,
      upcomingAppointments,
      missedAppointments,
      rescheduleRequestedAppointments,
      highRiskAlerts,
      getPatientById,
      getAccessiblePatientById,
      getAccessiblePatients,
      searchPatients,
      getPatientAppointments,
      recordVisit,
      addAppointment,
      markAppointmentAttended,
      markAppointmentMissed,
      rescheduleAppointment,
    ],
  );

  return <ClinicDataContext.Provider value={value}>{children}</ClinicDataContext.Provider>;
}

export function useClinicData() {
  const context = useContext(ClinicDataContext);

  if (!context) {
    throw new Error('useClinicData must be used within ClinicDataProvider');
  }

  return context;
}
