import { PaginatedResult } from '../entities/PaginatedResult';
import { PokemonSummary } from '../entities/PokemonSummary';
import { PokemonRepository } from '../repositories/PokemonRepository';

export interface GetPokemonListUseCase {
  execute(offset: number, limit: number): Promise<PaginatedResult<PokemonSummary>>;
}

export class GetPokemonListUseCaseImpl implements GetPokemonListUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(offset: number, limit: number): Promise<PaginatedResult<PokemonSummary>> {
    return this.repository.fetchPage(offset, limit);
  }
}
