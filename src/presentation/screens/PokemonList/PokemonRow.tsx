import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { PokemonSummary } from '../../../domain/entities/PokemonSummary';

function paddedId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

export function PokemonRow({ pokemon, onPress }: { pokemon: PokemonSummary; onPress: () => void }) {
  const label = `${pokemon.name}, ${paddedId(pokemon.id)}`;
  return (
    <Pressable
      onPress={onPress}
      style={styles.row}
      testID={`pokemon-row-${pokemon.id}`}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <FastImage
        source={{ uri: pokemon.imageUrl }}
        style={styles.thumbnail}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        <Text style={styles.id}>{paddedId(pokemon.id)}</Text>
      </View>
    </Pressable>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  id: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
