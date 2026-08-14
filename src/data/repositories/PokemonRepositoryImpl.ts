import { PaginatedResult } from '../../domain/entities/PaginatedResult';
import { PokemonDetail } from '../../domain/entities/PokemonDetail';
import { PokemonSummary } from '../../domain/entities/PokemonSummary';
import { PokemonRepository } from '../../domain/repositories/PokemonRepository';
import { PokemonDetailMapper } from '../mappers/PokemonDetailMapper';
import { PokemonListMapper } from '../mappers/PokemonListMapper';
import { PokemonLocalDataSource } from '../datasources/PokemonLocalDataSource';
import { PokemonRemoteDataSource } from '../datasources/PokemonRemoteDataSource';

// Estrategia network-first con fallback a cache: siempre intenta traer datos
// frescos de la red primero; solo si la petición falla recurre al cache local.
export class PokemonRepositoryImpl implements PokemonRepository {
  constructor(
    private readonly remote: PokemonRemoteDataSource,
    private readonly local: PokemonLocalDataSource,
  ) {}

  async fetchPage(offset: number, limit: number): Promise<PaginatedResult<PokemonSummary>> {
    try {
      const dto = await this.remote.fetchList(offset, limit);
      const items = PokemonListMapper.map(dto);
      const nextOffset = dto.next ? offset + limit : undefined;
      const result: PaginatedResult<PokemonSummary> = { items, nextOffset };
      await this.appendToListCache(items, nextOffset);
      return result;
    } catch (error) {
      const cached = await this.local.loadList();
      if (cached) {
        return cached;
      }
      throw error;
    }
  }

  private async appendToListCache(newItems: PokemonSummary[], nextOffset?: number): Promise<void> {
    const existing = await this.local.loadList();
    const existingItems = existing?.items ?? [];
    const merged = [...existingItems, ...newItems.filter(item => !existingItems.some(e => e.id === item.id))];
    await this.local.saveList({ items: merged, nextOffset });
  }

  async loadCachedPage(): Promise<PaginatedResult<PokemonSummary> | undefined> {
    return this.local.loadList();
  }

  async fetch(id: number): Promise<PokemonDetail> {
    try {
      const dto = await this.remote.fetchDetail(id);
      const detail = PokemonDetailMapper.map(dto);
      await this.local.saveDetail(detail);
      return detail;
    } catch (error) {
      const cached = await this.local.loadDetail(id);
      if (cached) {
        return cached;
      }
      throw error;
    }
  }

  async loadCached(id: number): Promise<PokemonDetail | undefined> {
    return this.local.loadDetail(id);
  }

  async save(entity: PokemonDetail): Promise<void> {
    await this.local.saveDetail(entity);
  }
}
