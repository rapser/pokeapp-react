import { PokemonDetail } from '../entities/PokemonDetail';
import { PokemonRepository } from '../repositories/PokemonRepository';

export interface GetPokemonDetailUseCase {
  execute(id: number): Promise<PokemonDetail>;
}

export class GetPokemonDetailUseCaseImpl implements GetPokemonDetailUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(id: number): Promise<PokemonDetail> {
    return this.repository.fetch(id);
  }
}
