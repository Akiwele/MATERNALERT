export type ClinicNotificationSettings = {
  newPatientTransferRequests: boolean;
  appointmentReminders: boolean;
  missedAppointmentAlerts: boolean;
  riskAlerts: boolean;
};

let clinicNotificationSettings: ClinicNotificationSettings = {
  newPatientTransferRequests: true,
  appointmentReminders: true,
  missedAppointmentAlerts: true,
  riskAlerts: true,
};

export function getClinicNotificationSettings(): ClinicNotificationSettings {
  return { ...clinicNotificationSettings };
}

export function updateClinicNotificationSettings(updates: Partial<ClinicNotificationSettings>) {
  clinicNotificationSettings = {
    ...clinicNotificationSettings,
    ...updates,
  };

  return clinicNotificationSettings;
}

export function resetClinicNotificationSettings() {
  clinicNotificationSettings = {
    newPatientTransferRequests: true,
    appointmentReminders: true,
    missedAppointmentAlerts: true,
    riskAlerts: true,
  };
}
