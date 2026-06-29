import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { BrandColors } from '@/constants/brand';
import { PatientDashboardTypography } from '@/constants/patient-dashboard-typography';
import type { WeightTrendPoint } from '@/utils/patient-home-dashboard';

const CHART_HEIGHT = 112;
const CHART_WIDTH = 320;
const CHART_PADDING = { top: 8, right: 8, bottom: 20, left: 28 };
const WEIGHT_LINE_COLOR = BrandColors.primary;

type WeightTrendChartProps = {
  data: WeightTrendPoint[];
  emptyMessage?: string;
};

function mapWeightPoints(data: WeightTrendPoint[], minY: number, maxY: number): string {
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
        ((point.weightKg - minY) / (maxY - minY)) * plotHeight;

      return `${x},${y}`;
    })
    .join(' ');
}

function getWeightPointCoordinates(
  data: WeightTrendPoint[],
  index: number,
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
    ((data[index].weightKg - minY) / (maxY - minY)) * plotHeight;

  return { x, y };
}

export function WeightTrendChart({
  data,
  emptyMessage = 'No weight records yet. Log your weight to see trends.',
}: WeightTrendChartProps) {
  if (data.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const values = data.map((point) => point.weightKg);
  const minY = Math.max(0, Math.min(...values) - 2);
  const maxY = Math.max(...values) + 2;
  const weightPoints = mapWeightPoints(data, minY, maxY);
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
          points={weightPoints}
          fill="none"
          stroke={WEIGHT_LINE_COLOR}
          strokeWidth={1.5}
        />

        {data.map((point, index) => {
          const coordinates = getWeightPointCoordinates(data, index, minY, maxY);

          return (
            <Circle
              key={`weight-${point.index}-${index}`}
              cx={coordinates.x}
              cy={coordinates.y}
              r={2.5}
              fill={WEIGHT_LINE_COLOR}
            />
          );
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
