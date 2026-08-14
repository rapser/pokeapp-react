import { GetPokemonDetailUseCaseImpl } from '../../../src/domain/usecases/GetPokemonDetailUseCase';
import { NetworkError } from '../../../src/core/NetworkError';
import { MockPokemonRepository } from '../../mocks/MockPokemonRepository';

describe('GetPokemonDetailUseCase', () => {
  it('returns mapped detail on success', async () => {
    const mock = new MockPokemonRepository();
    mock.detailResult = () =>
      Promise.resolve({
        id: 1,
        name: 'bulbasaur',
        imageUrl: undefined,
        types: ['grass', 'poison'],
        abilities: ['overgrow'],
        stats: [{ name: 'hp', value: 45, maxValue: 255 }],
        weightKg: 6.9,
        heightM: 0.7,
        baseExperience: 64,
      });
    const sut = new GetPokemonDetailUseCaseImpl(mock);

    const result = await sut.execute(1);

    expect(result.name).toBe('bulbasaur');
    expect(result.types).toEqual(['grass', 'poison']);
  });

  it('throws NetworkError on failure', async () => {
    const mock = new MockPokemonRepository();
    mock.detailResult = () => Promise.reject(NetworkError.serverError(500));
    const sut = new GetPokemonDetailUseCaseImpl(mock);

    await expect(sut.execute(1)).rejects.toEqual(NetworkError.serverError(500));
  });
});
