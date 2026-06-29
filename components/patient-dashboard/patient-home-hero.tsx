import { Bell } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';

const PROGRESS_CIRCLE_SIZE = 64;
const PROGRESS_RADIUS = 27;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;
const AVATAR_SIZE = 28;
const HEADER_ACTION_SIZE = 36;

type PatientHomeHeroProps = {
  initials: string;
  firstName: string;
  currentWeek: number;
  dueDate: string;
  showBpAlert: boolean;
  onNotificationsPress?: () => void;
};

export function PatientHomeHero({
  initials,
  firstName,
  currentWeek,
  dueDate,
  showBpAlert,
  onNotificationsPress,
}: PatientHomeHeroProps) {
  const weekProgress = Math.min(currentWeek / 40, 1);
  const strokeDashoffset = PROGRESS_CIRCUMFERENCE * (1 - weekProgress);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.nameWrap}>
            <Text style={styles.nameText} numberOfLines={1}>
              {firstName}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.bellButton}
          onPress={onNotificationsPress}
          accessibilityRole="button"
          accessibilityLabel="Notifications">
          <Bell size={20} color="rgba(255,255,255,0.8)" />
          {showBpAlert ? <View style={styles.alertDot} /> : null}
        </Pressable>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressRow}>
          <View style={styles.progressCircleWrap}>
            <Svg width={PROGRESS_CIRCLE_SIZE} height={PROGRESS_CIRCLE_SIZE}>
              <Circle
                cx={PROGRESS_CIRCLE_SIZE / 2}
                cy={PROGRESS_CIRCLE_SIZE / 2}
                r={PROGRESS_RADIUS}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={4}
                fill="none"
              />
              <Circle
                cx={PROGRESS_CIRCLE_SIZE / 2}
                cy={PROGRESS_CIRCLE_SIZE / 2}
                r={PROGRESS_RADIUS}
                stroke={BrandColors.white}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${PROGRESS_CIRCUMFERENCE}`}
                strokeDashoffset={strokeDashoffset}
                rotation={-90}
                origin={`${PROGRESS_CIRCLE_SIZE / 2}, ${PROGRESS_CIRCLE_SIZE / 2}`}
              />
            </Svg>
            <View style={styles.progressCircleCenter}>
              <Text style={styles.weekNumber}>{currentWeek}</Text>
              <Text style={styles.weekLabel}>weeks</Text>
            </View>
          </View>

          <View style={styles.progressCopy}>
            <Text style={styles.progressEyebrow}>Pregnancy Progress</Text>
            <Text style={styles.progressTitle}>Week {currentWeek} of 40</Text>
            <Text style={styles.dueDate}>Due {dueDate}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  identityRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
    paddingRight: 12,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: BrandColors.white,
    fontSize: PatientDashboardTypography.captionSmall,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  nameWrap: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: BrandColors.white,
    fontSize: PatientDashboardTypography.greeting,
    fontWeight: '700',
    lineHeight: PatientDashboardTypography.greeting,
    includeFontPadding: false,
    ...Platform.select({
      android: { textAlignVertical: 'center' as const },
      default: {},
    }),
  },
  bellButton: {
    position: 'relative',
    width: HEADER_ACTION_SIZE,
    height: HEADER_ACTION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FB7185',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  progressCard: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressCircleWrap: {
    width: PROGRESS_CIRCLE_SIZE,
    height: PROGRESS_CIRCLE_SIZE,
    flexShrink: 0,
  },
  progressCircleCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNumber: {
    color: BrandColors.white,
    fontSize: PatientDashboardTypography.cardTitleLarge,
    fontWeight: '700',
    lineHeight: 20,
  },
  weekLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: PatientDashboardTypography.captionSmall,
    lineHeight: 13,
    marginTop: 2,
  },
  progressCopy: {
    flex: 1,
    justifyContent: 'center',
  },
  progressEyebrow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  progressTitle: {
    color: BrandColors.white,
    fontSize: PatientDashboardTypography.sectionHeading,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 2,
  },
  dueDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    marginTop: 10,
  },
});
