import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialDesignIcons as Icon } from '@react-native-vector-icons/material-design-icons';

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel={message}>
      <Icon name="alert-circle-outline" size={48} color="#DC2626" />
      <Text style={styles.message}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Reintentar">
        <Text style={styles.buttonText}>Reintentar</Text>
      </Pressable>
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
  button: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
