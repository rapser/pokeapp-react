export interface PokemonListResultDTO {
  name: string;
  url: string;
}

export interface PokemonListResponseDTO {
  next: string | null;
  results: PokemonListResultDTO[];
}
