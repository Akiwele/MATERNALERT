import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import {
  getAncAppointmentsForPhone,
  subscribeAncAppointments,
  updateAncAppointments,
} from '@/stores/anc-appointments-store';
import {
  countConsecutiveMissedAncAppointments,
  getPatientMissedAncWarning,
  MISSED_TWO_CONSECUTIVE_REASON,
} from '@/utils/anc-risk-rules';
import {
  getPatientAppointmentsFromStore,
  getPatientPhoneForAppointments,
} from '@/utils/appointment-patient-view';
import { getAppointmentReminders, type AppointmentReminder } from '@/utils/appointment-reminders';
import {
  getAppointmentStatus,
  getNextUpcomingAppointment,
  sortAppointmentsByDate,
  type AntenatalAppointment,
} from '@/utils/appointments';

type AppointmentsContextValue = {
  appointments: AntenatalAppointment[];
  sortedAppointments: AntenatalAppointment[];
  upcomingAppointments: AntenatalAppointment[];
  missedAppointments: AntenatalAppointment[];
  completedAppointments: AntenatalAppointment[];
  nextAppointment: AntenatalAppointment | null;
  reminders: AppointmentReminder[];
  missedAncWarning: string | null;
  hasHighRiskFromMissedAnc: boolean;
  missedAncRiskReason: string | null;
  requestReschedule: (appointmentId: string) => void;
};

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

function usePatientAppointmentsSnapshot(): AntenatalAppointment[] {
  return useSyncExternalStore(
    subscribeAncAppointments,
    getPatientAppointmentsFromStore,
    getPatientAppointmentsFromStore,
  );
}

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const appointments = usePatientAppointmentsSnapshot();
  const clinicAppointments = useMemo(
    () => getAncAppointmentsForPhone(getPatientPhoneForAppointments()),
    [appointments],
  );

  const requestReschedule = useCallback((appointmentId: string) => {
    updateAncAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'reschedule_requested' }
          : appointment,
      ),
    );
  }, []);

  const sortedAppointments = useMemo(
    () => sortAppointmentsByDate(appointments),
    [appointments],
  );

  const upcomingAppointments = useMemo(
    () =>
      sortedAppointments.filter((appointment) => {
        const status = getAppointmentStatus(appointment);
        return status === 'upcoming' || status === 'reschedule_requested';
      }),
    [sortedAppointments],
  );

  const missedAppointments = useMemo(
    () =>
      sortedAppointments.filter(
        (appointment) => getAppointmentStatus(appointment) === 'missed',
      ),
    [sortedAppointments],
  );

  const completedAppointments = useMemo(
    () =>
      sortedAppointments.filter(
        (appointment) => getAppointmentStatus(appointment) === 'completed',
      ),
    [sortedAppointments],
  );

  const nextAppointment = useMemo(
    () => getNextUpcomingAppointment(appointments),
    [appointments],
  );

  const reminders = useMemo(() => getAppointmentReminders(appointments), [appointments]);
  const missedAncWarning = useMemo(
    () => getPatientMissedAncWarning(clinicAppointments),
    [clinicAppointments],
  );
  const consecutiveMissed = useMemo(
    () => countConsecutiveMissedAncAppointments(clinicAppointments),
    [clinicAppointments],
  );
  const hasHighRiskFromMissedAnc = consecutiveMissed >= 2;
  const missedAncRiskReason = hasHighRiskFromMissedAnc ? MISSED_TWO_CONSECUTIVE_REASON : null;

  const value = useMemo(
    () => ({
      appointments,
      sortedAppointments,
      upcomingAppointments,
      missedAppointments,
      completedAppointments,
      nextAppointment,
      reminders,
      missedAncWarning,
      hasHighRiskFromMissedAnc,
      missedAncRiskReason,
      requestReschedule,
    }),
    [
      appointments,
      sortedAppointments,
      upcomingAppointments,
      missedAppointments,
      completedAppointments,
      nextAppointment,
      reminders,
      missedAncWarning,
      hasHighRiskFromMissedAnc,
      missedAncRiskReason,
      requestReschedule,
    ],
  );

  return (
    <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);

  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }

  return context;
}
