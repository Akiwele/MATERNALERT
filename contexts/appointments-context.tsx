import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getNextUpcomingAppointment,
  sortAppointmentsByDate,
  type AntenatalAppointment,
  type AntenatalAppointmentInput,
} from '@/utils/appointments';

type AppointmentsContextValue = {
  appointments: AntenatalAppointment[];
  sortedAppointments: AntenatalAppointment[];
  nextAppointment: AntenatalAppointment | null;
  addAppointment: (input: AntenatalAppointmentInput) => void;
  markAppointmentCompleted: (id: string) => void;
};

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<AntenatalAppointment[]>([]);

  const addAppointment = useCallback((input: AntenatalAppointmentInput) => {
    setAppointments((current) => [
      ...current,
      {
        ...input,
        id: `apt-${Date.now()}`,
        completed: false,
      },
    ]);
  }, []);

  const markAppointmentCompleted = useCallback((id: string) => {
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, completed: true } : appointment,
      ),
    );
  }, []);

  const sortedAppointments = useMemo(
    () => sortAppointmentsByDate(appointments),
    [appointments],
  );

  const nextAppointment = useMemo(
    () => getNextUpcomingAppointment(appointments),
    [appointments],
  );

  const value = useMemo(
    () => ({
      appointments,
      sortedAppointments,
      nextAppointment,
      addAppointment,
      markAppointmentCompleted,
    }),
    [appointments, sortedAppointments, nextAppointment, addAppointment, markAppointmentCompleted],
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
