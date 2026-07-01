import { CalendarClock, CalendarPlus, ClipboardList, HeartPulse, TriangleAlert } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import type { ClinicActivity } from '@/types/clinic-records';
import { formatRelativeActivityTime } from '@/utils/clinic-date-utils';

type ClinicActivityItemProps = {
  activity: ClinicActivity;
};

function ActivityIcon({ type }: { type: ClinicActivity['type'] }) {
  const size = 16;
  const color = BrandColors.primaryDark;

  switch (type) {
    case 'visit_recorded':
      return <ClipboardList size={size} color={color} />;
    case 'appointment_added':
      return <CalendarPlus size={size} color={color} />;
    case 'high_bp_alert':
      return <HeartPulse size={size} color="#DC2626" />;
    case 'appointment_missed':
      return <TriangleAlert size={size} color="#B45309" />;
    case 'reschedule_requested':
      return <CalendarClock size={size} color="#B45309" />;
    default:
      return <ClipboardList size={size} color={color} />;
  }
}

export function ClinicActivityItem({ activity }: ClinicActivityItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <ActivityIcon type={activity.type} />
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>{activity.message}</Text>
        <Text style={styles.time}>{formatRelativeActivityTime(activity.createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.border,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BrandColors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  message: {
    fontSize: 14,
    color: BrandColors.text,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
});
