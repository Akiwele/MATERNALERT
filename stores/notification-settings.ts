export type NotificationSettings = {
  appointmentReminders: boolean;
  pregnancyTips: boolean;
  riskAlerts: boolean;
};

let notificationSettings: NotificationSettings = {
  appointmentReminders: true,
  pregnancyTips: true,
  riskAlerts: true,
};

export function getNotificationSettings(): NotificationSettings {
  return { ...notificationSettings };
}

export function updateNotificationSettings(updates: Partial<NotificationSettings>) {
  notificationSettings = {
    ...notificationSettings,
    ...updates,
  };

  return notificationSettings;
}

export function resetNotificationSettings() {
  notificationSettings = {
    appointmentReminders: true,
    pregnancyTips: true,
    riskAlerts: true,
  };
}
