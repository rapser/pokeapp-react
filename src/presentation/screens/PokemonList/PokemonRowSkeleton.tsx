import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

function ShimmerRow() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      <View style={styles.thumbnail} />
      <View style={styles.textContainer}>
        <View style={styles.nameLine} />
        <View style={styles.idLine} />
      </View>
    </Animated.View>
  );
}

export function PokemonRowSkeletonList({ count = 8 }: { count?: number }) {
  return (
    <View accessibilityLabel="Cargando lista de Pokémon">
      {Array.from({ length: count }).map((_, index) => (
        <ShimmerRow key={index} />
      ))}
    </View>
  );
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
    backgroundColor: '#E5E7EB',
  },
  textContainer: {
    flex: 1,
    gap: 8,
  },
  nameLine: {
    height: 14,
    width: '50%',
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  idLine: {
    height: 12,
    width: '25%',
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
});
