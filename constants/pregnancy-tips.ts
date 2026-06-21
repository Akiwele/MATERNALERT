export const PREGNANCY_TIPS = [
  'Drink plenty of water and eat iron-rich foods today.',
  'Take short walks to support healthy circulation and energy levels.',
  'Get adequate rest and listen to your body when you need a break.',
  'Eat small, balanced meals to help manage nausea and maintain energy.',
  'Practice gentle stretching or prenatal yoga if approved by your clinician.',
  'Keep track of baby movements and report any concerns to your clinic.',
];

export function getTodaysPregnancyTip(): string {
  const dayIndex = new Date().getDate() % PREGNANCY_TIPS.length;
  return PREGNANCY_TIPS[dayIndex];
}
