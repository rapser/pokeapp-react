import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PokemonStat } from '../../../../domain/entities/PokemonStat';

export function StatBar({ stat }: { stat: PokemonStat }) {
  const ratio = Math.min(stat.value / stat.maxValue, 1);
  const label = `${stat.name}: ${stat.value} de ${stat.maxValue}`;
  return (
    <View style={styles.container} accessibilityLabel={label}>
      <View style={styles.header}>
        <Text style={styles.name}>{formatStatName(stat.name)}</Text>
        <Text style={styles.value}>{stat.value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
    </View>
  );
}

function formatStatName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    color: '#374151',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
});
