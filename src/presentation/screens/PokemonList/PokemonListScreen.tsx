import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContainer } from '../../../di/DependencyProvider';
import { Tokens } from '../../../di/tokens';
import { GetPokemonListUseCase } from '../../../domain/usecases/GetPokemonListUseCase';
import { PokemonSummary } from '../../../domain/entities/PokemonSummary';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { PokemonRow } from './PokemonRow';
import { PokemonRowSkeletonList } from './PokemonRowSkeleton';
import { usePokemonListViewModel } from './usePokemonListViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'PokemonList'>;

export function PokemonListScreen({ navigation }: Props) {
  const container = useContainer();
  const useCase = container.resolve<GetPokemonListUseCase>(Tokens.GetPokemonListUseCase);
  const { state, isLoadingNextPage, errorMessage, loadInitialPageIfNeeded, loadNextPageIfNeeded, retry, dismissError } =
    usePokemonListViewModel(useCase);

  useEffect(() => {
    loadInitialPageIfNeeded();
  }, [loadInitialPageIfNeeded]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert('Aviso', errorMessage, [{ text: 'OK', onPress: dismissError }]);
    }
  }, [errorMessage, dismissError]);

  if (state.status === 'idle' || state.status === 'loading') {
    return <PokemonRowSkeletonList />;
  }

  if (state.status === 'error') {
    return <ErrorState message={state.message} onRetry={retry} />;
  }

  const items = state.data;

  if (items.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      testID="pokemon-list"
      data={items}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }: { item: PokemonSummary }) => (
        <PokemonRow pokemon={item} onPress={() => navigation.navigate('PokemonDetail', { id: item.id })} />
      )}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        const last = items[items.length - 1];
        if (last) {
          loadNextPageIfNeeded(last);
        }
      }}
      ListFooterComponent={
        isLoadingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 16,
  },
});
