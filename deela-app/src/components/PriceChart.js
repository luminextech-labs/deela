import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function PriceChart({ history }) {
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;

  const bars = history.map((price, i) => {
    const height = ((price - min) / range) * 60 + 10;
    const isLast = i === history.length - 1;
    return { height, price, isLast };
  });

  return (
    <View style={styles.container}>
      {/* Chart bars */}
      <View style={styles.chartArea}>
        {bars.map((bar, i) => (
          <View key={i} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: bar.height,
                  backgroundColor: bar.isLast ? COLORS.red : COLORS.purple,
                  opacity: bar.isLast ? 1 : 0.5,
                },
              ]}
            />
            {bar.isLast && <View style={styles.currentDot} />}
          </View>
        ))}
      </View>
      {/* Labels */}
      <View style={styles.labels}>
        <Text style={styles.labelText}>24 เม.ย.</Text>
        <Text style={[styles.labelText, { color: COLORS.red, fontWeight: '600' }]}>
          วันนี้: ฿{history[history.length - 1].toLocaleString()}
        </Text>
        <Text style={styles.labelText}>24 พ.ค.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 6,
    paddingHorizontal: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  bar: {
    width: '100%',
    borderRadius: 3,
    minHeight: 4,
  },
  currentDot: {
    position: 'absolute',
    top: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  labelText: { fontSize: 10, color: COLORS.textGray },
});