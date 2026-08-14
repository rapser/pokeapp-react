import { PaginatedResult } from '../../src/domain/entities/PaginatedResult';
import { PokemonDetail } from '../../src/domain/entities/PokemonDetail';
import { PokemonSummary } from '../../src/domain/entities/PokemonSummary';
import { PokemonRepository } from '../../src/domain/repositories/PokemonRepository';

// Mock configurable por resultado (éxito/fallo), equivalente a MockPokemonRepository.swift.
export class MockPokemonRepository implements PokemonRepository {
  summaryPageResult: () => Promise<PaginatedResult<PokemonSummary>> = () =>
    Promise.resolve({ items: [], nextOffset: undefined });

  detailResult?: () => Promise<PokemonDetail>;

  fetchPage(_offset: number, _limit: number): Promise<PaginatedResult<PokemonSummary>> {
    return this.summaryPageResult();
  }

  loadCachedPage(): Promise<PaginatedResult<PokemonSummary> | undefined> {
    return Promise.resolve(undefined);
  }

  fetch(_id: number): Promise<PokemonDetail> {
    if (!this.detailResult) {
      throw new Error('detailResult no fue configurado en el mock');
    }
    return this.detailResult();
  }

  loadCached(_id: number): Promise<PokemonDetail | undefined> {
    return Promise.resolve(undefined);
  }

  save(_entity: PokemonDetail): Promise<void> {
    return Promise.resolve();
  }
}
