export interface NamedResourceDTO {
  name: string;
}

export interface PokemonTypeSlotDTO {
  type: NamedResourceDTO;
}

export interface PokemonAbilitySlotDTO {
  ability: NamedResourceDTO;
}

export interface PokemonStatDTO {
  base_stat: number;
  stat: NamedResourceDTO;
}

export interface OfficialArtworkDTO {
  front_default: string | null;
}

export interface OtherSpritesDTO {
  'official-artwork'?: OfficialArtworkDTO;
}

export interface SpritesDTO {
  front_default: string | null;
  other?: OtherSpritesDTO;
}

export interface PokemonDTO {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: PokemonTypeSlotDTO[];
  abilities: PokemonAbilitySlotDTO[];
  stats: PokemonStatDTO[];
  sprites: SpritesDTO;
}
