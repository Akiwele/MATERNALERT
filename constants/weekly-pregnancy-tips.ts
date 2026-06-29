export type WeeklyPregnancyTip = {
  title: string;
  body: string;
  milestone: string;
};

export const WEEKLY_PREGNANCY_TIPS: Record<number, WeeklyPregnancyTip> = {
  16: {
    title: 'Week 16 — Feeling Movement',
    body: 'You may start feeling fluttering movements. Continue taking prenatal vitamins and stay hydrated.',
    milestone: 'Baby can hear your voice',
  },
  20: {
    title: 'Week 20 — Halfway Point',
    body: "You're halfway through your pregnancy. An anatomy scan helps check baby's development.",
    milestone: 'Baby is about the size of a banana',
  },
  28: {
    title: 'Week 28 — Third Trimester Begins',
    body: 'Your baby now weighs about 1 kg and can blink their eyes. Discuss a birth plan with your midwife and attend all remaining antenatal visits.',
    milestone: 'Baby can now recognise your voice',
  },
  32: {
    title: 'Week 32 — Rapid Growth',
    body: 'Your baby is gaining weight quickly. Watch for swelling and report any sudden changes.',
    milestone: 'Baby practices breathing movements',
  },
};

const DEFAULT_WEEK = 28;

export function getWeeklyPregnancyTip(week: number): WeeklyPregnancyTip {
  if (WEEKLY_PREGNANCY_TIPS[week]) {
    return WEEKLY_PREGNANCY_TIPS[week];
  }

  const availableWeeks = Object.keys(WEEKLY_PREGNANCY_TIPS)
    .map(Number)
    .sort((left, right) => left - right);

  const matchedWeek =
    [...availableWeeks].reverse().find((tipWeek) => tipWeek <= week) ?? DEFAULT_WEEK;

  return WEEKLY_PREGNANCY_TIPS[matchedWeek] ?? WEEKLY_PREGNANCY_TIPS[DEFAULT_WEEK];
}
