import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialDesignIcons as Icon } from '@react-native-vector-icons/material-design-icons';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface InfoItem {
  icon: IconName;
  title: string;
  value: string;
}

export function PhysicalInfoRow({ weightKg, heightM, baseExperience }: { weightKg: number; heightM: number; baseExperience: number }) {
  const items: InfoItem[] = [
    { icon: 'weight-kilogram', title: 'Peso', value: `${weightKg} kg` },
    { icon: 'ruler', title: 'Altura', value: `${heightM} m` },
    { icon: 'star-outline', title: 'Exp. base', value: String(baseExperience) },
  ];

  return (
    <View style={styles.container}>
      {items.map(item => (
        <View key={item.title} style={styles.item} accessibilityLabel={`${item.title}: ${item.value}`}>
          <Icon name={item.icon} size={22} color="#4B5563" />
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  title: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
