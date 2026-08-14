import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialDesignIcons as Icon } from '@react-native-vector-icons/material-design-icons';

export function EmptyState({ message = 'No hay Pokémon para mostrar.' }: { message?: string }) {
  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={message}>
      <Icon name="inbox-outline" size={48} color="#9CA3AF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
