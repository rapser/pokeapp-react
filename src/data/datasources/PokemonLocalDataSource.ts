import { getCached, setCached } from '../../core/storage';
import { PaginatedResult } from '../../domain/entities/PaginatedResult';
import { PokemonDetail } from '../../domain/entities/PokemonDetail';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';

const LIST_CACHE_KEY = 'pokemon_list_all';
const detailCacheKey = (id: number) => `pokemon_detail_${id}`;

export interface PokemonLocalDataSource {
  loadList(): Promise<PaginatedResult<PokemonSummary> | undefined>;
  saveList(result: PaginatedResult<PokemonSummary>): Promise<void>;
  loadDetail(id: number): Promise<PokemonDetail | undefined>;
  saveDetail(detail: PokemonDetail): Promise<void>;
}

export class PokemonLocalDataSourceImpl implements PokemonLocalDataSource {
  loadList(): Promise<PaginatedResult<PokemonSummary> | undefined> {
    return getCached<PaginatedResult<PokemonSummary>>(LIST_CACHE_KEY);
  }

  saveList(result: PaginatedResult<PokemonSummary>): Promise<void> {
    return setCached(LIST_CACHE_KEY, result);
  }

  loadDetail(id: number): Promise<PokemonDetail | undefined> {
    return getCached<PokemonDetail>(detailCacheKey(id));
  }

  saveDetail(detail: PokemonDetail): Promise<void> {
    return setCached(detailCacheKey(detail.id), detail);
  }
}
