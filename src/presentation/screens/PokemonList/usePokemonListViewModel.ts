import { useCallback, useRef, useState } from 'react';
import { GetPokemonListUseCase } from '../../../domain/usecases/GetPokemonListUseCase';
import { PokemonSummary } from '../../../domain/entities/PokemonSummary';
import { ViewState } from '../../../core/ViewState';
import { isNetworkError, userMessage, NetworkError } from '../../../core/NetworkError';

const PAGE_SIZE = 20;

export function usePokemonListViewModel(useCase: GetPokemonListUseCase) {
  const [state, setState] = useState<ViewState<PokemonSummary[]>>(ViewState.idle());
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const itemsRef = useRef<PokemonSummary[]>([]);
  const nextOffsetRef = useRef<number | undefined>(0);
  const isFetchingRef = useRef(false);

  const fetchNextPage = useCallback(async () => {
    if (isFetchingRef.current || nextOffsetRef.current === undefined) {
      return;
    }
    isFetchingRef.current = true;
    const isPaginating = itemsRef.current.length > 0;
    setIsLoadingNextPage(isPaginating);

    try {
      const offset = nextOffsetRef.current;
      const result = await useCase.execute(offset, PAGE_SIZE);
      itemsRef.current = [...itemsRef.current, ...result.items];
      nextOffsetRef.current = result.nextOffset;
      setState(ViewState.loaded([...itemsRef.current]));
    } catch (error) {
      const netError: NetworkError = isNetworkError(error) ? error : NetworkError.unknown();
      if (itemsRef.current.length === 0) {
        setState(ViewState.error(userMessage(netError)));
      } else {
        setErrorMessage(userMessage(netError));
      }
    } finally {
      isFetchingRef.current = false;
      setIsLoadingNextPage(false);
    }
  }, [useCase]);

  const loadInitialPageIfNeeded = useCallback(async () => {
    if (itemsRef.current.length > 0 || state.status !== 'idle') {
      return;
    }
    setState(ViewState.loading());
    await fetchNextPage();
  }, [fetchNextPage, state.status]);

  const loadNextPageIfNeeded = useCallback(
    async (currentItem: PokemonSummary) => {
      const lastItem = itemsRef.current[itemsRef.current.length - 1];
      if (!lastItem || lastItem.id !== currentItem.id) {
        return;
      }
      await fetchNextPage();
    },
    [fetchNextPage],
  );

  const retry = useCallback(async () => {
    setState(ViewState.loading());
    await fetchNextPage();
  }, [fetchNextPage]);

  const dismissError = useCallback(() => setErrorMessage(undefined), []);

  return {
    state,
    isLoadingNextPage,
    errorMessage,
    loadInitialPageIfNeeded,
    loadNextPageIfNeeded,
    retry,
    dismissError,
  };
}
