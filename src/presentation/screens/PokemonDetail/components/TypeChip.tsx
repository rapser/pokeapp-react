import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TYPE_COLORS: Record<string, string> = {
  fire: '#EF4444',
  water: '#3B82F6',
  grass: '#22C55E',
  electric: '#EAB308',
  psychic: '#EC4899',
  ice: '#14B8A6',
  dragon: '#6366F1',
  dark: '#4B5563',
  fairy: '#D946EF',
  normal: '#9CA3AF',
  fighting: '#F97316',
  flying: '#06B6D4',
  poison: '#A855F7',
  ground: '#B45309',
  rock: '#92400E',
  bug: '#65A30D',
  ghost: '#4F46E5',
  steel: '#71717A',
};

const DEFAULT_COLOR = '#6B7280';

export function TypeChip({ type }: { type: string }) {
  const color = TYPE_COLORS[type] ?? DEFAULT_COLOR;
  return (
    <View style={[styles.chip, { backgroundColor: color }]} accessibilityLabel={`Tipo ${type}`}>
      <Text style={styles.label}>{capitalize(type)}</Text>
    </View>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
