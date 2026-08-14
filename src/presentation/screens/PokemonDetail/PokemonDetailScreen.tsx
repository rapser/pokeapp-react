import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContainer } from '../../../di/DependencyProvider';
import { Tokens } from '../../../di/tokens';
import { GetPokemonDetailUseCase } from '../../../domain/usecases/GetPokemonDetailUseCase';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { ErrorState } from '../../components/ErrorState';
import { TypeChip } from './components/TypeChip';
import { StatBar } from './components/StatBar';
import { PhysicalInfoRow } from './components/PhysicalInfoRow';
import { usePokemonDetailViewModel } from './usePokemonDetailViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonDetail'>;

function paddedId(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function PokemonDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const container = useContainer();
  const useCase = container.resolve<GetPokemonDetailUseCase>(Tokens.GetPokemonDetailUseCase);
  const { state, loadIfNeeded, retry } = usePokemonDetailViewModel(id, useCase);

  useEffect(() => {
    loadIfNeeded();
  }, [loadIfNeeded]);

  useEffect(() => {
    if (state.status === 'loaded') {
      navigation.setOptions({ title: capitalize(state.data.name) });
    }
  }, [state, navigation]);

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <View style={styles.centered} accessibilityLabel="Cargando detalle del Pokémon">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />;
  }

  const pokemon = state.data;

  return (
    <ScrollView contentContainerStyle={styles.content} testID="pokemon-detail-scroll">
      <View style={styles.header}>
        <FastImage
          source={{ uri: pokemon.imageUrl }}
          style={styles.artwork}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.id}>{paddedId(pokemon.id)}</Text>
      </View>

      <View style={styles.typesRow}>
        {pokemon.types.map(type => (
          <TypeChip key={type} type={type} />
        ))}
      </View>

      <PhysicalInfoRow
        weightKg={pokemon.weightKg}
        heightM={pokemon.heightM}
        baseExperience={pokemon.baseExperience}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        {pokemon.abilities.map(ability => (
          <Text key={ability} style={styles.ability}>
            {capitalize(ability.replace(/-/g, ' '))}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {pokemon.stats.map(stat => (
          <StatBar key={stat.name} stat={stat} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  artwork: {
    width: 180,
    height: 180,
  },
  id: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  typesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  ability: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
});
