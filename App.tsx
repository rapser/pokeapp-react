import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DependencyProvider } from './src/di/DependencyProvider';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <DependencyProvider>
        <RootNavigator />
      </DependencyProvider>
    </SafeAreaProvider>
  );
}
