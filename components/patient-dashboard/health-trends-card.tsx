import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BpTrendChart } from '@/components/patient-dashboard/bp-trend-chart';
import { WeightTrendChart } from '@/components/patient-dashboard/weight-trend-chart';
import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { BpTrendPoint, WeightTrendPoint } from '@/utils/patient-home-dashboard';

type HealthTrendTab = 'bp' | 'weight';

type HealthTrendsCardProps = {
  bpData: BpTrendPoint[];
  weightData: WeightTrendPoint[];
};
 
const TABS: { id: HealthTrendTab; label: string }[] = [
  { id: 'bp', label: 'BP' },
  { id: 'weight', label: 'Weight' },
];

export function HealthTrendsCard({ bpData, weightData }: HealthTrendsCardProps) {
  const [selectedTab, setSelectedTab] = useState<HealthTrendTab>('bp');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Health Trends</Text>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = selectedTab === tab.id;

          return (
            <Pressable
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setSelectedTab(tab.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {selectedTab === 'bp' ? (
        <BpTrendChart data={bpData} />
      ) : (
        <WeightTrendChart data={weightData} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.border,
    padding: 16,
  },
  title: {
    fontSize: PatientDashboardTypography.cardTitle,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: BrandColors.primaryMuted,
    borderRadius: 10,
    padding: 3,
    gap: 2,
    marginBottom: 12,
  },
  tab: {
    minWidth: 72,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: BrandColors.white,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: PatientDashboardTypography.caption,
    fontWeight: '600',
    color: BrandColors.textSecondary,
  },
  tabTextActive: {
    color: BrandColors.primaryDark,
  },
});
