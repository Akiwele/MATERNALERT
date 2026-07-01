import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import { isEmptyProfileDisplayValue } from '@/utils/profile-display';

type ProfileSectionCardProps = {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function ProfileSectionCard({
  title,
  children,
  actionLabel,
  onActionPress,
}: ProfileSectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {actionLabel && onActionPress ? (
          <Pressable onPress={onActionPress} hitSlop={8}>
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

type ProfileDetailRowProps = {
  label: string;
  value?: string | null;
};

export function ProfileDetailRow({ label, value }: ProfileDetailRowProps) {
  const hasValue = !isEmptyProfileDisplayValue(value);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {hasValue ? (
        <Text style={styles.value}>{value?.trim()}</Text>
      ) : (
        <View style={styles.emptyValue} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BrandColors.border,
    shadowColor: BrandColors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '700',
    color: BrandColors.text,
  },
  action: {
    fontSize: PatientDashboardTypography.label,
    fontWeight: '600',
    color: BrandColors.primary,
  },
  content: {
    gap: 12,
  },
  row: {
    gap: 4,
  },
  label: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  value: {
    fontSize: PatientDashboardTypography.bodySmall,
    color: BrandColors.text,
    lineHeight: 24,
  },
  emptyValue: {
    minHeight: 24,
  },
});
