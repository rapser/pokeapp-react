import { AxiosInstance } from 'axios';
import { mapAxiosError } from '../../core/NetworkError';
import { PokemonDTO } from '../dtos/PokemonDTO';
import { PokemonListResponseDTO } from '../dtos/PokemonListResponseDTO';

export interface PokemonRemoteDataSource {
  fetchList(offset: number, limit: number): Promise<PokemonListResponseDTO>;
  fetchDetail(id: number): Promise<PokemonDTO>;
}

export class PokemonRemoteDataSourceImpl implements PokemonRemoteDataSource {
  constructor(private readonly client: AxiosInstance) {}

  async fetchList(offset: number, limit: number): Promise<PokemonListResponseDTO> {
    try {
      const response = await this.client.get<PokemonListResponseDTO>('/pokemon', {
        params: { offset, limit },
      });
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  }

  async fetchDetail(id: number): Promise<PokemonDTO> {
    try {
      const response = await this.client.get<PokemonDTO>(`/pokemon/${id}`);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  }
}
