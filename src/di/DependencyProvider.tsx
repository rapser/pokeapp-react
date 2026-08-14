import React, { createContext, useContext, useMemo } from 'react';
import { buildContainer } from './assemblies';
import { Container } from './Container';

const DependencyContext = createContext<Container | undefined>(undefined);

export function DependencyProvider({ children }: { children: React.ReactNode }) {
  const container = useMemo(() => buildContainer(), []);
  return <DependencyContext.Provider value={container}>{children}</DependencyContext.Provider>;
}

export function useContainer(): Container {
  const container = useContext(DependencyContext);
  if (!container) {
    throw new Error('useContainer debe usarse dentro de un <DependencyProvider>');
  }
  return container;
}
