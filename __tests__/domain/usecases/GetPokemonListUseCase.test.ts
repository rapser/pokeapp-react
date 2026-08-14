import { GetPokemonListUseCaseImpl } from '../../../src/domain/usecases/GetPokemonListUseCase';
import { NetworkError, userMessage } from '../../../src/core/NetworkError';
import { MockPokemonRepository } from '../../mocks/MockPokemonRepository';
import { hasMore } from '../../../src/domain/entities/PaginatedResult';

describe('GetPokemonListUseCase', () => {
  it('returns mapped summaries on success', async () => {
    const mock = new MockPokemonRepository();
    mock.summaryPageResult = () =>
      Promise.resolve({
        items: [{ id: 1, name: 'bulbasaur' }],
        nextOffset: 20,
      });
    const sut = new GetPokemonListUseCaseImpl(mock);

    const result = await sut.execute(0, 20);

    expect(result.items[0]?.name).toBe('bulbasaur');
    expect(result.nextOffset).toBe(20);
    expect(hasMore(result)).toBe(true);
  });

  it('throws NetworkError on failure', async () => {
    const mock = new MockPokemonRepository();
    mock.summaryPageResult = () => Promise.reject(NetworkError.noConnection());
    const sut = new GetPokemonListUseCaseImpl(mock);

    await expect(sut.execute(0, 20)).rejects.toEqual(NetworkError.noConnection());
    try {
      await sut.execute(0, 20);
      fail('Se esperaba un error');
    } catch (error) {
      expect(userMessage(error as NetworkError)).toContain('conexión');
    }
  });
});
