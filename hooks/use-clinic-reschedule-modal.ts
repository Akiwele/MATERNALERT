import { useCallback, useState, type ComponentProps } from 'react';

import type { ClinicRescheduleModal } from '@/components/clinic/clinic-reschedule-modal';
import { useClinicData } from '@/contexts/clinic-data-context';
import type { ClinicAppointment } from '@/types/clinic-records';

type RescheduleModalProps = Pick<
  ComponentProps<typeof ClinicRescheduleModal>,
  'visible' | 'appointment' | 'onClose' | 'onConfirm'
>;

export function useClinicRescheduleModal() {
  const { rescheduleAppointment } = useClinicData();
  const [rescheduleTarget, setRescheduleTarget] = useState<ClinicAppointment | null>(null);

  const openReschedule = useCallback((appointment: ClinicAppointment) => {
    setRescheduleTarget(appointment);
  }, []);

  const closeReschedule = useCallback(() => {
    setRescheduleTarget(null);
  }, []);

  const rescheduleModalProps: RescheduleModalProps = {
    visible: rescheduleTarget !== null,
    appointment: rescheduleTarget,
    onClose: closeReschedule,
    onConfirm: rescheduleAppointment,
  };

  return {
    openReschedule,
    closeReschedule,
    rescheduleModalProps,
  };
}
