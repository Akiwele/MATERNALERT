import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { BpTrendPoint } from '@/utils/patient-home-dashboard';

const CHART_HEIGHT = 112;
const CHART_WIDTH = 320;
const CHART_PADDING = { top: 8, right: 8, bottom: 20, left: 28 };
const SYSTOLIC_COLOR = '#C94F5A';
const DIASTOLIC_COLOR = BrandColors.primary;

type BpTrendChartProps = {
  data: BpTrendPoint[];
  emptyMessage?: string;
};

function mapPoints(
  data: BpTrendPoint[],
  key: 'sys' | 'dia',
  minY: number,
  maxY: number,
): string {
  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  return data
    .map((point, index) => {
      const x =
        CHART_PADDING.left +
        (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
      const y =
        CHART_PADDING.top +
        plotHeight -
        ((point[key] - minY) / (maxY - minY)) * plotHeight;

      return `${x},${y}`;
    })
    .join(' ');
}

function getPointCoordinates(
  data: BpTrendPoint[],
  index: number,
  key: 'sys' | 'dia',
  minY: number,
  maxY: number,
) {
  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
  const x =
    CHART_PADDING.left +
    (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
  const y =
    CHART_PADDING.top +
    plotHeight -
    ((data[index][key] - minY) / (maxY - minY)) * plotHeight;

  return { x, y };
}

export function BpTrendChart({
  data,
  emptyMessage = 'No BP readings yet. Log your health to see trends.',
}: BpTrendChartProps) {
  if (data.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const values = data.flatMap((point) => [point.sys, point.dia]);
  const minY = Math.max(60, Math.min(...values) - 10);
  const maxY = Math.min(150, Math.max(...values) + 10);
  const systolicPoints = mapPoints(data, 'sys', minY, maxY);
  const diastolicPoints = mapPoints(data, 'dia', minY, maxY);
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  return (
    <View style={styles.container}>
      <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        {[0, 1, 2, 3].map((index) => {
          const y = CHART_PADDING.top + (index / 3) * plotHeight;
          return (
            <Line
              key={index}
              x1={CHART_PADDING.left}
              y1={y}
              x2={CHART_WIDTH - CHART_PADDING.right}
              y2={y}
              stroke="rgba(0,0,0,0.06)"
              strokeDasharray="3 3"
            />
          );
        })}

        <Polyline
          points={systolicPoints}
          fill="none"
          stroke={SYSTOLIC_COLOR}
          strokeWidth={1.5}
        />
        <Polyline
          points={diastolicPoints}
          fill="none"
          stroke={DIASTOLIC_COLOR}
          strokeWidth={1.5}
        />

        {data.flatMap((point, index) => {
          const sysPoint = getPointCoordinates(data, index, 'sys', minY, maxY);
          const diaPoint = getPointCoordinates(data, index, 'dia', minY, maxY);

          return [
            <Circle
              key={`sys-${point.week}-${index}`}
              cx={sysPoint.x}
              cy={sysPoint.y}
              r={2.5}
              fill={SYSTOLIC_COLOR}
            />,
            <Circle
              key={`dia-${point.week}-${index}`}
              cx={diaPoint.x}
              cy={diaPoint.y}
              r={2.5}
              fill={DIASTOLIC_COLOR}
            />,
          ];
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CHART_HEIGHT,
  },
  emptyState: {
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  emptyText: {
    fontSize: PatientDashboardTypography.caption,
    lineHeight: 18,
    color: BrandColors.textSecondary,
    textAlign: 'center',
  },
});
