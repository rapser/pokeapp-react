import { PokemonDetail } from '../../domain/entities/PokemonDetail';
import { PokemonDTO } from '../dtos/PokemonDTO';

const MAX_STAT_VALUE = 255;

export const PokemonDetailMapper = {
  map(dto: PokemonDTO): PokemonDetail {
    const imageUrl = dto.sprites.other?.['official-artwork']?.front_default ?? dto.sprites.front_default ?? undefined;

    return {
      id: dto.id,
      name: dto.name,
      imageUrl,
      types: dto.types.map(slot => slot.type.name),
      abilities: dto.abilities.map(slot => slot.ability.name),
      stats: dto.stats.map(stat => ({
        name: stat.stat.name,
        value: stat.base_stat,
        maxValue: MAX_STAT_VALUE,
      })),
      weightKg: dto.weight / 10,
      heightM: dto.height / 10,
      baseExperience: dto.base_experience ?? 0,
    };
  },
};
