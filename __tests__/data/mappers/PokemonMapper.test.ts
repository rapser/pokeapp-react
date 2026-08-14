import { PokemonListMapper } from '../../../src/data/mappers/PokemonListMapper';
import { PokemonDetailMapper } from '../../../src/data/mappers/PokemonDetailMapper';
import { PokemonListResponseDTO } from '../../../src/data/dtos/PokemonListResponseDTO';
import { PokemonDTO } from '../../../src/data/dtos/PokemonDTO';

describe('PokemonListMapper', () => {
  it('extracts the id from the resource url', () => {
    expect(PokemonListMapper.extractId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    expect(PokemonListMapper.extractId('https://pokeapi.co/api/v2/pokemon/1')).toBe(1);
    expect(PokemonListMapper.extractId('https://pokeapi.co/api/v2/pokemon/not-a-number/')).toBeUndefined();
  });

  it('maps the full list response to summaries', () => {
    const dto: PokemonListResponseDTO = {
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };

    const summaries = PokemonListMapper.map(dto);

    expect(summaries).toHaveLength(2);
    expect(summaries[0]).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    });
  });
});

describe('PokemonDetailMapper', () => {
  const baseDto: PokemonDTO = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    base_experience: 64,
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    abilities: [{ ability: { name: 'overgrow' } }],
    stats: [{ base_stat: 45, stat: { name: 'hp' } }],
    sprites: {
      front_default: 'https://example.com/fallback.png',
      other: {
        'official-artwork': { front_default: 'https://example.com/artwork.png' },
      },
    },
  };

  it('converts units and maps fields', () => {
    const detail = PokemonDetailMapper.map(baseDto);

    expect(detail.weightKg).toBeCloseTo(6.9);
    expect(detail.heightM).toBeCloseTo(0.7);
    expect(detail.types).toEqual(['grass', 'poison']);
    expect(detail.abilities).toEqual(['overgrow']);
    expect(detail.stats).toEqual([{ name: 'hp', value: 45, maxValue: 255 }]);
    expect(detail.imageUrl).toBe('https://example.com/artwork.png');
    expect(detail.baseExperience).toBe(64);
  });

  it('falls back to sprites.front_default when official artwork is missing', () => {
    const dto: PokemonDTO = { ...baseDto, sprites: { front_default: 'https://example.com/fallback.png' } };

    const detail = PokemonDetailMapper.map(dto);

    expect(detail.imageUrl).toBe('https://example.com/fallback.png');
  });

  it('defaults baseExperience to 0 when null', () => {
    const dto: PokemonDTO = { ...baseDto, base_experience: null };

    const detail = PokemonDetailMapper.map(dto);

    expect(detail.baseExperience).toBe(0);
  });
});
