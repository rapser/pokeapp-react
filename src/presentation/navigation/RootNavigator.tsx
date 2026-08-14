import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PokemonListScreen } from '../screens/PokemonList/PokemonListScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetail/PokemonDetailScreen';

export type RootStackParamList = {
  PokemonList: undefined;
  PokemonDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PokemonList">
        <Stack.Screen name="PokemonList" component={PokemonListScreen} options={{ title: 'Pokédex' }} />
        <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} options={{ title: 'Detalle' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
