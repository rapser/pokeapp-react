import { PokemonStat } from './PokemonStat';

export interface PokemonDetail {
  id: number;
  name: string;
  imageUrl?: string;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
  weightKg: number;
  heightM: number;
  baseExperience: number;
}
