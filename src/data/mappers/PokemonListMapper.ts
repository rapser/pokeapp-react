import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { PokemonListResponseDTO, PokemonListResultDTO } from '../dtos/PokemonListResponseDTO';

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export const PokemonListMapper = {
  map(dto: PokemonListResponseDTO): PokemonSummary[] {
    return dto.results.map(PokemonListMapper.mapItem);
  },

  mapItem(dto: PokemonListResultDTO): PokemonSummary {
    const id = PokemonListMapper.extractId(dto.url) ?? 0;
    return { id, name: dto.name, imageUrl: PokemonListMapper.artworkUrl(id) };
  },

  // La PokeAPI no incluye el id en el listado, solo la URL del recurso
  // (ej. https://pokeapi.co/api/v2/pokemon/25/), así que se extrae del path.
  extractId(url: string): number | undefined {
    const trimmed = url.endsWith('/') ? url.slice(0, -1) : url;
    const segments = trimmed.split('/');
    const last = segments[segments.length - 1];
    const parsed = Number(last);
    return Number.isFinite(parsed) ? parsed : undefined;
  },

  artworkUrl(id: number): string {
    return `${ARTWORK_BASE_URL}/${id}.png`;
  },
};
