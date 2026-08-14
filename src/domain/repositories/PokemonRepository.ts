import { PaginatedResult } from '../entities/PaginatedResult';
import { PokemonDetail } from '../entities/PokemonDetail';
import { PokemonSummary } from '../entities/PokemonSummary';

export interface PokemonRepository {
  fetchPage(offset: number, limit: number): Promise<PaginatedResult<PokemonSummary>>;
  loadCachedPage(): Promise<PaginatedResult<PokemonSummary> | undefined>;
  fetch(id: number): Promise<PokemonDetail>;
  loadCached(id: number): Promise<PokemonDetail | undefined>;
  save(entity: PokemonDetail): Promise<void>;
}
