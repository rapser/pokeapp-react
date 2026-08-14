import { useCallback, useState } from 'react';
import { GetPokemonDetailUseCase } from '../../../domain/usecases/GetPokemonDetailUseCase';
import { PokemonDetail } from '../../../domain/entities/PokemonDetail';
import { ViewState } from '../../../core/ViewState';
import { isNetworkError, userMessage, NetworkError } from '../../../core/NetworkError';

export function usePokemonDetailViewModel(pokemonId: number, useCase: GetPokemonDetailUseCase) {
  const [state, setState] = useState<ViewState<PokemonDetail>>(ViewState.idle());

  const load = useCallback(async () => {
    setState(ViewState.loading());
    try {
      const detail = await useCase.execute(pokemonId);
      setState(ViewState.loaded(detail));
    } catch (error) {
      const netError: NetworkError = isNetworkError(error) ? error : NetworkError.unknown();
      setState(ViewState.error(userMessage(netError)));
    }
  }, [pokemonId, useCase]);

  const loadIfNeeded = useCallback(async () => {
    if (state.status !== 'idle') {
      return;
    }
    await load();
  }, [load, state.status]);

  return { state, loadIfNeeded, retry: load };
}
